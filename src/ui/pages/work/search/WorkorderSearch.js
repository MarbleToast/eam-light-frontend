import React from 'react';
import { Link } from 'react-router-dom';
import Typography from '@material-ui/core/Typography';
import { EAMCellField } from 'eam-components/dist/ui/components/grids/eam/utils';
import EAMGrid from 'eam-components/dist/ui/components/grids/eam/EAMGrid';
import SyncedQueryParamsEAMGridContext from "../../../../tools/SyncedQueryParamsEAMGridContext";

const cellRenderer = ({ column, value }) => {
    if (column.id === 'workordernum') {
        return (
            <Typography>
                <Link to={"/workorder/" + value}>
                    {value}
                </Link>
            </Typography>
        )
    }

    return EAMCellField({ column, value });
}

const WorkorderSearch = (props) => {
    const { workOrderScreen, handleError } = props;
    return (
        <SyncedQueryParamsEAMGridContext
            gridName={workOrderScreen.screenCode}
            handleError={handleError}
            searchOnMount={workOrderScreen.startupAction !== "N"}
            cellRenderer={cellRenderer}
            key={workOrderScreen.screenCode}
        >
            <EAMGrid />
        </SyncedQueryParamsEAMGridContext>
    );
}

export default WorkorderSearch;
