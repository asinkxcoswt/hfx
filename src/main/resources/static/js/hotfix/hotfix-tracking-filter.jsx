import { utils } from 'react-data-grid';
const { getMixedTypeValueRetriever, isImmutableCollection } = utils;

import { createSelector } from 'reselect';
const { isEmptyObject } = utils;

const filterSingleRow = (r, columnKey, filters, retriever) => {
    if ( filters.hasOwnProperty( columnKey ) ) {
        let colFilter = filters[columnKey];
        
        if (colFilter.filterTerm.indexOf(",") > -1) {
            colFilter.filterTerm = colFilter.filterTerm.split(/, */)
        }
        // check if custom filter function exists
        if ( colFilter.filterValues && typeof colFilter.filterValues === 'function' ) {
            if (colFilter.filterValues( r, colFilter, columnKey )) {
                return true;    
            } else {
                return false;
            }
        } else if ( colFilter.filterTerm && typeof colFilter.filterTerm === 'string' ) {
            // default filter action
            let rowValue = retriever.getValue( r, columnKey );
            if (colFilter.filterTerm === "?") {
                if (rowValue) {
                    return false;
                } else {
                    return true;
                }
            } else if (colFilter.filterTerm === "!?") {
                if (rowValue) {
                    return true;
                } else {
                    return false;
                }
            } else {
                if ( rowValue && rowValue.toString().toLowerCase().indexOf( colFilter.filterTerm.toLowerCase() ) > -1) {
                    return true;
                } else {
                    return false;
                }
            }
        } else if ( colFilter.filterTerm && colFilter.filterTerm instanceof Array ) {
            let rowValue = retriever.getValue( r, columnKey );
            for ( let term of colFilter.filterTerm ) {
                if ( rowValue && rowValue.toString().toLowerCase().indexOf( term ) > -1 ) {
                    return true
                }
            }
            return false;
        } else {
            return true;
        }
    } else {
        return true;
    }    
}

const filterRows = ( filters, rows = [] ) => {
    const retriever = getMixedTypeValueRetriever( isImmutableCollection( rows ) );
    return rows.filter( r => {
        for ( let columnKey in filters ) {
            if (!filterSingleRow(r, columnKey, filters, retriever)) {
                return false;
            }
        }
        return true;
    });
};

const getInputRows = ( state ) => state.rows;
const getFilters = ( state ) => state.filters;
const getFilteredRows = createSelector( [getFilters, getInputRows], ( filters, rows = [] ) => {
    if ( !filters || isEmptyObject( filters ) ) {
        return rows;
    }
    return filterRows( filters, rows );
});

export const Selectors = {
    getRows: getFilteredRows,
};
