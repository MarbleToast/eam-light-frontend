import React, { useState, useEffect } from 'react';
import CustomFieldInput from './CustomFieldInput';
import WSCustomFields from '../../../tools/WSCustomFields';
import SimpleEmptyState from 'eam-components/dist/ui/components/emptystates/SimpleEmptyState';
import { isCernMode } from '../CERNMode';

function CustomFields(props) {
    let [lookupValues, setLookupValues] = useState(null);
    let { updateEntityProperty, customFields, readonly, children, classCode, entityCode } = props;

    useEffect(() => {
        if (customFields) {
            fetchLookupValues(entityCode, classCode);
        }
    }, [entityCode, classCode, customFields]);

    let fetchLookupValues = (entityCode, classCode) => {
        WSCustomFields.getCustomFieldsLookupValues(entityCode, classCode).then((response) =>
            setLookupValues(response.body.data)
        );
    };

    let updateCustomFieldValue = (index, valueKey, value) => {
        updateEntityProperty(`customField.${index}.${valueKey}`, value);
    };

    const isEmptyState = !customFields || customFields.length === 0;
    return isEmptyState ? (
        <SimpleEmptyState message="No Custom Fields to show." />
    ) : (
        <div style={{ width: '100%', marginTop: 0 }}>
            {/* The custom fields starting with MTFX were temporarily used to have a similar functionality to
                    the Line Title in the Associate Custom Fields screen of Infor EAM. They may now be hidden. */}
            {customFields
                .filter((customField) => !customField.code.startsWith('MTFX') || !isCernMode)
                .map((customField, index) => (
                    <CustomFieldInput
                        children={children}
                        key={index}
                        updateCustomFieldValue={updateCustomFieldValue.bind(null, index)}
                        customField={customField}
                        index={index}
                        lookupValues={lookupValues}
                        readonly={readonly}
                    />
                ))}
        </div>
    );
}

CustomFields.defaultProps = {
    title: 'CUSTOM FIELDS',
    readonly: false,
};

export default React.memo(CustomFields);
