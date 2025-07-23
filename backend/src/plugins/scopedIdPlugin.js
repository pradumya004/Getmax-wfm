// backend/src/plugins/scopedIdPlugin.js

import { v4 as uuidv4 } from 'uuid';
import mongoose from 'mongoose';

export function scopedIdPlugin(schema, options) {
    const {
        idField = 'customId',
        prefix = 'GEN',
        companyRefPath = 'companyRef',
        companyModel = 'Company'
    } = options;

    schema.pre('validate', async function (next) {
        if (this[idField]) return next();

        const Company = mongoose.model(companyModel);
        const company = await Company.findById(this[companyRefPath]).select('companyCode');

        const code = company?.companyCode || 'GENERIC';
        const uid = uuidv4().slice(0, 6).toUpperCase();

        this[idField] = `${prefix}-${code}-${uid}`;
        next();
    });
}
