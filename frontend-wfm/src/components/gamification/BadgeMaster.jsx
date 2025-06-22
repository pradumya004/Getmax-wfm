import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { Timer, ShieldCheck, Package, RefreshCw, PlusCircle, Edit, Trash2 } from 'lucide-react';
import BadgeRuleModal from './BadgeRuleModal';

const initialBadgeRules = [
  { id: 1, name: 'SLA Champ', triggerLogic: '>95% SLA compliance for 30 days', icon: 'Timer', module: 'SLA Timer', condition: '> 95', duration: '30 days', xpPoints: 500, repeatAllowed: false },
  { id: 2, name: 'QA Hero', triggerLogic: 'Avg QA > 97% for 2 weeks', icon: 'ShieldCheck', module: 'QA Audit', condition: '> 97', duration: '2 weeks', xpPoints: 750, repeatAllowed: true },
  { id: 3, name: 'Volume Master', triggerLogic: 'Crosses 120% daily volume for 10 days', icon: 'Package', module: 'Claim Intake', condition: '> 120%', duration: '10 days', xpPoints: 300, repeatAllowed: true },
  { id: 4, name: 'Comeback Kid', triggerLogic: 'Moves from <80% QA to >95% in 2 weeks', icon: 'RefreshCw', module: 'QA Audit', condition: '< 80 to > 95', duration: '2 weeks', xpPoints: 1000, repeatAllowed: false },
];

const iconMap = {
  Timer: Timer,
  ShieldCheck: ShieldCheck,
  Package: Package,
  RefreshCw: RefreshCw,
  default: ShieldCheck
};

const BadgeMaster = () => {
  const { toast } = useToast();
  const [rules, setRules] = useState(initialBadgeRules);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRule, setEditingRule] = useState(null);

  const handleAddNew = () => {
    setEditingRule(null);
    setIsModalOpen(true);
  };

  const handleEdit = (rule) => {
    setEditingRule(rule);
    setIsModalOpen(true);
  };

  const handleDelete = (ruleId, ruleName) => {
    setRules(rules.filter(rule => rule.id !== ruleId));
    toast({
      title: `Rule Deleted`,
      description: `The badge rule "${ruleName}" has been deleted.`,
      variant: 'destructive'
    });
  };

  const handleSave = (ruleData) => {
    const isEditing = !!ruleData.id;
    if (isEditing) {
      setRules(rules.map(rule => (rule.id === ruleData.id ? ruleData : rule)));
    } else {
      setRules([...rules, { ...ruleData, id: Date.now() }]);
    }
    toast({
      title: 'Success!',
      description: `Badge rule "${ruleData.name}" has been ${isEditing ? 'updated' : 'created'}.`,
      className: "bg-[#39ff14] text-black"
    });
    setIsModalOpen(false);
  };
  
  const getIconComponent = (iconName) => {
    return iconMap[iconName] || iconMap.default;
  }

  return (
    <>
      <Card className="bg-glass-dark border-[#39ff14]/20">
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle className="text-white">Badge Master</CardTitle>
              <CardDescription className="text-gray-400">Define and manage badge trigger logic.</CardDescription>
            </div>
            <Button className="bg-[#39ff14] text-black hover:bg-[#00ff88]" onClick={handleAddNew}>
              <PlusCircle className="h-4 w-4 mr-2" />
              Add New Rule
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow className="border-b-[#39ff14]/20 hover:bg-transparent">
                <TableHead>Icon</TableHead>
                <TableHead>Badge Name</TableHead>
                <TableHead>Trigger Logic</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rules.map(rule => {
                const IconComponent = getIconComponent(rule.icon);
                return (
                  <TableRow key={rule.id} className="border-b-0">
                    <TableCell><IconComponent className="h-6 w-6 text-[#39ff14]" /></TableCell>
                    <TableCell className="font-medium text-white">{rule.name}</TableCell>
                    <TableCell className="text-gray-400">{rule.triggerLogic}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex gap-1 justify-end">
                        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleEdit(rule)}>
                          <Edit className="h-4 w-4 text-blue-400" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleDelete(rule.id, rule.name)}>
                          <Trash2 className="h-4 w-4 text-red-500" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <BadgeRuleModal
        isOpen={isModalOpen}
        setIsOpen={setIsModalOpen}
        rule={editingRule}
        onSave={handleSave}
      />
    </>
  );
};

export default BadgeMaster;