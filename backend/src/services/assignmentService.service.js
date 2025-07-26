// backend/src/services/assignmentService.service.js

import { ApiError } from "../utils/ApiError.js";
import { Employee } from "../models/core/employee.model.js";
import { ClaimTasks } from "../models/workflow/claimtasks.model.js";
import { Performance } from "../models/performance/performance.model.js";
import { FloatingPool } from './../models/workflow/floating-pool.model.js';
import { createNotification } from "./notificationService.service.js";
import { getDateRange } from "../utils/dateUtils.js";
import {
    ASSIGNMENT_ALGORITHMS,
    TASK_STATUSES,
    TASK_PRIORITIES,
    CLAIM_TYPE_SKILLS,
    WORKLOAD_THRESHOLDS,
    DEFAULT_VALUES,
    HYBRID_WEIGHTS,
    ASSIGNMENT_METHODS,
    ASSIGNMENT_MESSAGES
} from "../../../shared/constants/assignmentConstants.js";

// Auto-assign Tasks
export const autoAssignTasks = async (companyId, algorithm = ASSIGNMENT_ALGORITHMS.HYBRID, options = {}) => {
    try {
        // Get unassigned tasks
        const unassignedTasks = await ClaimTask.find({
            companyRef: companyId,
            status: TASK_STATUSES.NEW,
            assignedTo: { $exists: false }
        })
            .sort({ priority: -1, createdAt: 1 })
            .lean();

        if (unassignedTasks.length === 0) {
            return { assigned: 0, message: ASSIGNMENT_MESSAGES.NO_TASKS };
        }

        // Get available employees
        const availableEmployees = await getAvailableEmployees(companyId, options);
        if (availableEmployees.length === 0) {
            return { assigned: 0, message: ASSIGNMENT_MESSAGES.NO_EMPLOYEES };
        }

        const assignments = [];
        const bulkOps = [];
        const notifications = [];

        for (const task of unassignedTasks) {
            const assignedEmployee = await selectEmployeeForTask(task, availableEmployees, algorithm);

            if (assignedEmployee) {
                // Assign task
                const assignmentData = {
                    assignedTo: assignedEmployee._id,
                    status: TASK_STATUSES.ASSIGNED,
                    'timeTracking.assignedAt': new Date(),
                    assignmentDetails: {
                        assignedBy: 'System',
                        assignmentMethod: algorithm,
                        assignmentReason: getAssignmentReason(assignedEmployee, task, algorithm)
                    }
                };

                bulkOps.push({
                    updateOne: {
                        filter: { _id: task._id },
                        update: { $set: assignmentData }
                    }
                });

                assignments.push({
                    taskId: task._id,
                    employeeId: assignedEmployee._id,
                    employeeName: `${assignedEmployee.personalInfo.firstName} ${assignedEmployee.personalInfo.lastName}`,
                    algorithm
                });

                // Update employee workload
                assignedEmployee.currentWorkload = (assignedEmployee.currentWorkload || 0) + 1;
                assignedEmployee.workloadPercentage = (assignedEmployee.currentWorkload / assignedEmployee.maxCapacity) * 100;

                notifications.push({
                    companyRef: companyId,
                    recipients: [{ type: 'Employee', id: assignedEmployee._id }],
                    title: 'New Task Assigned',
                    message: `You have been assigned a new ${task.claimType} task: ${task.claimNumber}`,
                    type: 'info',
                    category: 'Tasks',
                    actionRequired: true,
                    actionUrl: `/tasks/${task._id}`,
                    actionText: 'View Task',
                    sendEmail: false,
                    createdBy: assignedEmployee._id
                });
            }
        }

        // Bulk update tasks
        if (bulkOps.length > 0) {
            await ClaimTasks.bulkWrite(bulkOps);
        }

        // Send notifications
        for (const notification of notifications) {
            await createNotification(notification);
        }

        return {
            assigned: assignments.length,
            assignments,
            algorithm,
            totalTasks: unassignedTasks.length
        };

    } catch (error) {
        throw new ApiError(500, `Failed to auto-assign tasks: ${error.message}`);
    }
};

// Get Available Employees
const getAvailableEmployees = async (companyId, options = {}) => {
    try {
        const query = {
            companyRef: companyId,
            'status.employeeStatus': 'Active'
        };

        // Filter by department if specified
        if (options.departmentId) {
            query.departmentRef = options.departmentId;
        }

        // Filter by role if specified
        if (options.roleId) {
            query.roleRef = options.roleId;
        }

        // Filter by skills if specified
        if (options.requiredSkills?.length > 0) {
            query['skillsAndQualifications.skills.skillName'] = { $in: options.requiredSkills };
        }

        const employees = await Employee.find(query)
            .populate('roleRef', 'roleName roleLevel permissions')
            .populate('departmentRef', 'departmentName')
            .select('personalInfo employmentInfo skillsAndQualifications roleRef departmentRef performanceTargets workSchedule')
            .lean();

        // Calculate current workload for each employee
        const employeesWithWorkload = await Promise.all(
            employees.map(async (employee) => {
                const currentTasks = await ClaimTasks.countDocuments({
                    assignedTo: employee._id,
                    status: { $in: [TASK_STATUSES.ASSIGNED, TASK_STATUSES.IN_PROGRESS] }
                });

                const maxCapacity = employee.performanceTargets?.dailyTargets?.tasksPerDay || DEFAULT_VALUES.MAX_CAPACITY;
                const workloadPercentage = (currentTasks / maxCapacity) * 100;

                return {
                    ...employee,
                    currentWorkload: currentTasks,
                    maxCapacity,
                    workloadPercentage,
                    isAvailable: workloadPercentage < WORKLOAD_THRESHOLDS.AVAILABLE,
                    lastAssignmentAt: employee.lastAssignmentAt || new Date(0)
                };
            })
        );

        // Filter only available employees
        return employeesWithWorkload.filter(emp => emp.isAvailable);

    } catch (error) {
        throw new ApiError(500, `Failed to get available employees: ${error.message}`);
    }
};

// Select Employee for Task
const selectEmployeeForTask = async (task, availableEmployees, algorithm) => {
    if (availableEmployees.length === 0) return null;

    switch (algorithm) {
        case ASSIGNMENT_ALGORITHMS.ROUND_ROBIN:
            return selectByRoundRobin(availableEmployees);

        case ASSIGNMENT_ALGORITHMS.SKILL_BASED:
            return selectBySkills(task, availableEmployees);

        case ASSIGNMENT_ALGORITHMS.WORKLOAD_BALANCED:
            return selectByWorkload(availableEmployees);

        case ASSIGNMENT_ALGORITHMS.PERFORMANCE_BASED:
            return await selectByPerformance(availableEmployees);

        case ASSIGNMENT_ALGORITHMS.PRIORITY_FIRST:
            return selectByPriority(task, availableEmployees);

        case ASSIGNMENT_ALGORITHMS.HYBRID:
            return await selectByHybrid(task, availableEmployees);

        default:
            return selectByWorkload(availableEmployees);
    }
};

// Round Robin Assignment
const selectByRoundRobin = (employees) => {
    return employees.sort((a, b) => a.lastAssignmentAt - b.lastAssignmentAt)[0];
};

// Skill-based Assignment
const selectBySkills = (task, employees) => {
    const requiredSkills = getRequiredSkillsForTask(task);

    // Score employees based on skill match
    const scoredEmployees = employees.map(employee => {
        const employeeSkills = employee.skillsAndQualifications?.skills || [];
        const skillMatches = requiredSkills.filter(skill =>
            employeeSkills.some(empSkill => empSkill.skillName === skill)
        ).length;

        const skillScore = requiredSkills.length > 0
            ? (skillMatches / requiredSkills.length) * 100
            : DEFAULT_VALUES.SKILL_SCORE;

        return { ...employee, skillScore };
    });

    // Return employee with highest skill score and lowest workload
    return scoredEmployees
        .sort((a, b) => {
            if (b.skillScore !== a.skillScore) {
                return b.skillScore - a.skillScore;
            }
            return a.workloadPercentage - b.workloadPercentage;
        })[0];
};

// Workload-based Assignment
const selectByWorkload = (employees) => {
    return employees.sort((a, b) => a.workloadPercentage - b.workloadPercentage)[0];
};

// Performance-based Assignment
const selectByPerformance = async (employees) => {
    try {
        // Get recent performance data for employees
        const employeesWithPerformance = await Promise.all(
            employees.map(async (employee) => {
                const recentPerformance = await Performance.findOne({
                    employeeRef: employee._id,
                    'period.periodType': 'current_month'
                })
                    .sort({ calculatedAt: -1 })
                    .lean();

                const performanceScore = recentPerformance?.scores?.overallScore || DEFAULT_VALUES.PERFORMANCE_SCORE;

                return { ...employee, performanceScore };
            })
        );

        return employeesWithPerformance.sort((a, b) => {
            if (b.performanceScore !== a.performanceScore) {
                return b.performanceScore - a.performanceScore;
            }
            return a.workloadPercentage - b.workloadPercentage;
        })[0];

    } catch (error) {
        console.error('Error in performance-based selection:', error);
        return selectByWorkload(employees);
    }
};

// Priority-based Assignment
const selectByPriority = (task, employees) => {
    const isHighPriority = [TASK_PRIORITIES.HIGH, TASK_PRIORITIES.CRITICAL].includes(task.priority);

    if (isHighPriority) {
        const highCapacityEmployees = employees.filter(emp =>
            emp.workloadPercentage < WORKLOAD_THRESHOLDS.HIGH_CAPACITY
        );

        if (highCapacityEmployees.length > 0) {
            return selectByWorkload(highCapacityEmployees);
        }
    }

    return selectByWorkload(employees);
};

// Hybrid Assignment (combines multiple factors)
const selectByHybrid = async (task, employees) => {
    try {
        const requiredSkills = getRequiredSkillsForTask(task);

        const scoredEmployees = await Promise.all(
            employees.map(async (employee) => {
                // Skill score
                const employeeSkills = employee.skillsAndQualifications?.skills || [];
                const skillMatches = requiredSkills.filter(skill =>
                    employeeSkills.some(empSkill => empSkill.skillName === skill)
                ).length;
                const skillScore = requiredSkills.length > 0
                    ? (skillMatches / requiredSkills.length) * 100
                    : DEFAULT_VALUES.SKILL_SCORE;

                // Workload score (inverse)
                const workloadScore = Math.max(0, 100 - employee.workloadPercentage);

                // Performance score
                const recentPerformance = await Performance.findOne({
                    employeeRef: employee._id,
                    'period.periodType': 'current_month'
                })
                    .sort({ calculatedAt: -1 })
                    .lean();
                const performanceScore = recentPerformance?.scores?.overallScore || DEFAULT_VALUES.PERFORMANCE_SCORE;

                // Priority score
                let priorityScore = 50;
                if (task.priority === TASK_PRIORITIES.CRITICAL && employee.workloadPercentage < WORKLOAD_THRESHOLDS.OPTIMAL) {
                    priorityScore = 100;
                } else if (task.priority === TASK_PRIORITIES.HIGH && employee.workloadPercentage < WORKLOAD_THRESHOLDS.HIGH_CAPACITY) {
                    priorityScore = 80;
                }

                // Weighted total score
                const totalScore =
                    (skillScore * HYBRID_WEIGHTS.SKILL) +
                    (workloadScore * HYBRID_WEIGHTS.WORKLOAD) +
                    (performanceScore * HYBRID_WEIGHTS.PERFORMANCE) +
                    (priorityScore * HYBRID_WEIGHTS.PRIORITY);

                return {
                    ...employee,
                    scores: {
                        skill: skillScore,
                        workload: workloadScore,
                        performance: performanceScore,
                        priority: priorityScore,
                        total: totalScore
                    }
                };
            })
        );

        return scoredEmployees.sort((a, b) => b.scores.total - a.scores.total)[0];

    } catch (error) {
        console.error('Error in hybrid selection:', error);
        return selectByWorkload(employees);
    }
};

// Get Required Skills for Task
const getRequiredSkillsForTask = (task) => {
    return CLAIM_TYPE_SKILLS[task.claimType] || ['Claims Processing'];
};

// Get Assignment Reason
const getAssignmentReason = (employee, task, algorithm) => {
    const reasons = {
        [ASSIGNMENT_ALGORITHMS.ROUND_ROBIN]: 'Round robin distribution',
        [ASSIGNMENT_ALGORITHMS.SKILL_BASED]: `Best skill match for ${task.claimType}`,
        [ASSIGNMENT_ALGORITHMS.WORKLOAD_BALANCED]: `Lowest workload (${Math.round(employee.workloadPercentage)}%)`,
        [ASSIGNMENT_ALGORITHMS.PERFORMANCE_BASED]: 'High performance rating',
        [ASSIGNMENT_ALGORITHMS.PRIORITY_FIRST]: `${task.priority} priority task`,
        [ASSIGNMENT_ALGORITHMS.HYBRID]: 'Best overall match (hybrid algorithm)'
    };

    return reasons[algorithm] || 'Automatic assignment';
};

// Manual Assignment
export const manualAssignTask = async (taskId, employeeId, assignedBy, reason = '') => {
    try {
        const [task, employee] = await Promise.all([
            ClaimTasks.findById(taskId).lean(),
            Employee.findById(employeeId)
                .select('personalInfo performanceTargets')
                .lean()
        ]);

        if (!task) {
            throw new ApiError(404, ASSIGNMENT_MESSAGES.TASK_NOT_FOUND);
        }
        if (!employee) {
            throw new ApiError(404, ASSIGNMENT_MESSAGES.EMPLOYEE_NOT_FOUND);
        }

        // Check capacity
        const currentTasks = await ClaimTasks.countDocuments({
            assignedTo: employeeId,
            status: { $in: [TASK_STATUSES.ASSIGNED, TASK_STATUSES.IN_PROGRESS] }
        });

        const maxCapacity = employee.performanceTargets?.dailyTargets?.tasksPerDay || DEFAULT_VALUES.MAX_CAPACITY;
        if (currentTasks >= maxCapacity) {
            throw new ApiError(400, ASSIGNMENT_MESSAGES.EMPLOYEE_AT_CAPACITY);
        }

        const updateData = {
            assignedTo: employeeId,
            status: TASK_STATUSES.ASSIGNED,
            'timeTracking.assignedAt': new Date(),
            assignmentDetails: {
                assignedBy: assignedBy.toString(),
                assignmentMethod: ASSIGNMENT_METHODS.MANUAL,
                assignmentReason: reason || 'Manual assignment'
            }
        };

        await Promise.all([
            ClaimTasks.findByIdAndUpdate(taskId, { $set: updateData }),
            Employee.findByIdAndUpdate(employeeId, { $set: { lastAssignmentAt: new Date() } }),
            createNotification({
                companyRef: task.companyRef,
                recipients: [{ type: 'Employee', id: employeeId }],
                title: 'New Task Assigned',
                message: `You have been assigned a new ${task.claimType} task: ${task.claimNumber}`,
                type: 'info',
                category: 'Tasks',
                actionRequired: true,
                actionUrl: `/tasks/${taskId}`,
                actionText: 'View Task',
                sendEmail: false,
                createdBy: assignedBy
            })
        ]);

        return {
            success: true,
            taskId,
            employeeId,
            assignedAt: new Date()
        };

    } catch (error) {
        if (error instanceof ApiError) throw error;
        throw new ApiError(500, `Failed to manually assign task: ${error.message}`);
    }
};

// Reassign Task
export const reassignTask = async (taskId, newEmployeeId, reassignedBy, reason = '') => {
    try {
        const [task, newEmployee] = await Promise.all([
            ClaimTasks.findById(taskId).lean(),
            Employee.findById(newEmployeeId)
                .select('personalInfo performanceTargets')
                .lean()
        ]);

        if (!task) {
            throw new ApiError(404, ASSIGNMENT_MESSAGES.TASK_NOT_FOUND);
        }
        if (!newEmployee) {
            throw new ApiError(404, ASSIGNMENT_MESSAGES.EMPLOYEE_NOT_FOUND);
        }

        const oldEmployeeId = task.assignedTo;

        // Check new employee capacity
        const currentTasks = await ClaimTasks.countDocuments({
            assignedTo: newEmployeeId,
            status: { $in: [TASK_STATUSES.ASSIGNED, TASK_STATUSES.IN_PROGRESS] }
        });

        const maxCapacity = newEmployee.performanceTargets?.dailyTargets?.tasksPerDay || DEFAULT_VALUES.MAX_CAPACITY;
        if (currentTasks >= maxCapacity) {
            throw new ApiError(400, ASSIGNMENT_MESSAGES.EMPLOYEE_AT_CAPACITY);
        }

        const updateData = {
            assignedTo: newEmployeeId,
            'timeTracking.reassignedAt': new Date(),
            'timeTracking.previousAssignee': oldEmployeeId,
            'assignmentDetails.reassignedBy': reassignedBy.toString(),
            'assignmentDetails.reassignmentReason': reason,
            'assignmentDetails.reassignedAt': new Date()
        };

        const notifications = [
            // Notify new employee
            createNotification({
                companyRef: task.companyRef,
                recipients: [{ type: 'Employee', id: newEmployeeId }],
                title: 'Task Reassigned to You',
                message: `Task ${task.claimNumber} has been reassigned to you. ${reason}`,
                type: 'info',
                category: 'Tasks',
                actionRequired: true,
                actionUrl: `/tasks/${taskId}`,
                actionText: 'View Task',
                sendEmail: false,
                createdBy: reassignedBy
            })
        ];

        // Notify old employee if different
        if (oldEmployeeId && oldEmployeeId.toString() !== newEmployeeId.toString()) {
            notifications.push(
                createNotification({
                    companyRef: task.companyRef,
                    recipients: [{ type: 'Employee', id: oldEmployeeId }],
                    title: 'Task Reassigned',
                    message: `Task ${task.claimNumber} has been reassigned to another employee.`,
                    type: 'info',
                    category: 'Tasks',
                    actionRequired: false,
                    sendEmail: false,
                    createdBy: reassignedBy
                })
            );
        }

        await Promise.all([
            ClaimTasks.findByIdAndUpdate(taskId, { $set: updateData }),
            Employee.findByIdAndUpdate(newEmployeeId, { $set: { lastAssignmentAt: new Date() } }),
            ...notifications
        ]);

        return {
            success: true,
            taskId,
            oldEmployeeId,
            newEmployeeId,
            reassignedAt: new Date()
        };

    } catch (error) {
        if (error instanceof ApiError) throw error;
        throw new ApiError(500, `Failed to reassign task: ${error.message}`);
    }
};

// Bulk Assignment
export const bulkAssignTasks = async (assignments, assignedBy) => {
    try {
        const results = {
            successful: 0,
            failed: 0,
            errors: []
        };

        const batchSize = 10;
        for (let i = 0; i < assignments.length; i += batchSize) {
            const batch = assignments.slice(i, i + batchSize);

            await Promise.all(
                batch.map(async (assignment) => {
                    try {
                        await manualAssignTask(
                            assignment.taskId,
                            assignment.employeeId,
                            assignedBy,
                            assignment.reason
                        );
                        results.successful++;
                    } catch (error) {
                        results.failed++;
                        results.errors.push({
                            taskId: assignment.taskId,
                            employeeId: assignment.employeeId,
                            error: error.message
                        });
                    }
                })
            );
        }

        return results;

    } catch (error) {
        throw new ApiError(500, `Failed to bulk assign tasks: ${error.message}`);
    }
};

// Get Assignment Statistics
export const getAssignmentStatistics = async (companyId, period = 'current_month') => {
    try {
        const dateRange = getDateRange(period);

        const [assignmentStats, workloadStats] = await Promise.all([
            // Assignment method statistics
            ClaimTasks.aggregate([
                {
                    $match: {
                        companyRef: companyId,
                        'timeTracking.assignedAt': { $gte: dateRange.start, $lte: dateRange.end }
                    }
                },
                {
                    $group: {
                        _id: '$assignmentDetails.assignmentMethod',
                        count: { $sum: 1 },
                        avgTimeToAssign: {
                            $avg: {
                                $subtract: ['$timeTracking.assignedAt', '$createdAt']
                            }
                        }
                    }
                }
            ]),

            // Workload distribution
            Employee.aggregate([
                { $match: { companyRef: companyId, 'status.employeeStatus': 'Active' } },
                {
                    $lookup: {
                        from: 'claimtasks',
                        let: { employeeId: '$_id' },
                        pipeline: [
                            {
                                $match: {
                                    $expr: { $eq: ['$assignedTo', '$$employeeId'] },
                                    status: { $in: [TASK_STATUSES.ASSIGNED, TASK_STATUSES.IN_PROGRESS] }
                                }
                            }
                        ],
                        as: 'activeTasks'
                    }
                },
                {
                    $project: {
                        employeeName: {
                            $concat: ['$personalInfo.firstName', ' ', '$personalInfo.lastName']
                        },
                        activeTaskCount: { $size: '$activeTasks' },
                        maxCapacity: {
                            $ifNull: ['$performanceTargets.dailyTargets.tasksPerDay', DEFAULT_VALUES.MAX_CAPACITY]
                        }
                    }
                },
                {
                    $addFields: {
                        workloadPercentage: {
                            $multiply: [
                                { $divide: ['$activeTaskCount', '$maxCapacity'] },
                                100
                            ]
                        }
                    }
                }
            ])
        ]);

        return {
            assignmentMethods: assignmentStats,
            workloadDistribution: workloadStats,
            period: dateRange
        };

    } catch (error) {
        throw new ApiError(500, `Failed to get assignment statistics: ${error.message}`);
    }
};

// Unassign Task
export const unassignTask = async (taskId, unassignedBy, reason = '') => {
    try {
        const task = await ClaimTasks.findById(taskId).lean();
        if (!task) {
            throw new ApiError(404, ASSIGNMENT_MESSAGES.TASK_NOT_FOUND);
        }

        if (!task.assignedTo) {
            throw new ApiError(400, 'Task is not assigned to anyone');
        }

        const updateData = {
            $unset: { assignedTo: 1 },
            $set: {
                status: TASK_STATUSES.NEW,
                'timeTracking.unassignedAt': new Date(),
                'assignmentDetails.unassignedBy': unassignedBy.toString(),
                'assignmentDetails.unassignmentReason': reason
            }
        };

        await Promise.all([
            ClaimTasks.findByIdAndUpdate(taskId, updateData),
            createNotification({
                companyRef: task.companyRef,
                recipients: [{ type: 'Employee', id: task.assignedTo }],
                title: 'Task Unassigned',
                message: `Task ${task.claimNumber} has been unassigned. ${reason}`,
                type: 'info',
                category: 'Tasks',
                actionRequired: false,
                sendEmail: false,
                createdBy: unassignedBy
            })
        ]);

        return {
            success: true,
            taskId,
            previousEmployeeId: task.assignedTo,
            unassignedAt: new Date()
        };

    } catch (error) {
        if (error instanceof ApiError) throw error;
        throw new ApiError(500, `Failed to unassign task: ${error.message}`);
    }
};

// Get Employee Workload
export const getEmployeeWorkload = async (employeeId, period = 'current_month') => {
    try {
        const dateRange = getDateRange(period);

        const [employee, taskStats] = await Promise.all([
            Employee.findById(employeeId)
                .select('personalInfo performanceTargets')
                .lean(),

            ClaimTasks.aggregate([
                {
                    $match: {
                        assignedTo: employeeId,
                        'timeTracking.assignedAt': { $gte: dateRange.start, $lte: dateRange.end }
                    }
                },
                {
                    $group: {
                        _id: '$status',
                        count: { $sum: 1 },
                        avgCompletionTime: {
                            $avg: {
                                $cond: [
                                    { $eq: ['$status', TASK_STATUSES.COMPLETED] },
                                    { $subtract: ['$timeTracking.completedAt', '$timeTracking.assignedAt'] },
                                    null
                                ]
                            }
                        }
                    }
                }
            ])
        ]);

        if (!employee) {
            throw new ApiError(404, ASSIGNMENT_MESSAGES.EMPLOYEE_NOT_FOUND);
        }

        const maxCapacity = employee.performanceTargets?.dailyTargets?.tasksPerDay || DEFAULT_VALUES.MAX_CAPACITY;
        const currentTasks = await ClaimTasks.countDocuments({
            assignedTo: employeeId,
            status: { $in: [TASK_STATUSES.ASSIGNED, TASK_STATUSES.IN_PROGRESS] }
        });

        const workloadPercentage = (currentTasks / maxCapacity) * 100;

        return {
            employee: {
                id: employeeId,
                name: `${employee.personalInfo.firstName} ${employee.personalInfo.lastName}`,
                maxCapacity
            },
            workload: {
                currentTasks,
                maxCapacity,
                workloadPercentage: Math.round(workloadPercentage),
                availableCapacity: Math.max(0, maxCapacity - currentTasks)
            },
            statistics: taskStats,
            period: dateRange
        };

    } catch (error) {
        if (error instanceof ApiError) throw error;
        throw new ApiError(500, `Failed to get employee workload: ${error.message}`);
    }
};