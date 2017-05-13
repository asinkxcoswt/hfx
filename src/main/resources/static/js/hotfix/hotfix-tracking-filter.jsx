import { utils } from 'react-data-grid';
const { getMixedTypeValueRetriever, isImmutableCollection } = utils;

import { createSelector } from 'reselect';
const { isEmptyObject } = utils;

const filterRows = ( filters, rows = [] ) => {
    const retriever = getMixedTypeValueRetriever( isImmutableCollection( rows ) );
    return rows.filter( r => {
        let include = true;
        for ( let columnKey in filters ) {
            //            console.log("In columnKey: " + columnKey)
            if ( filters.hasOwnProperty( columnKey ) ) {
                let colFilter = filters[columnKey];
                // check if custom filter function exists
                if ( colFilter.filterValues && typeof colFilter.filterValues === 'function' && !colFilter.filterValues( r, colFilter, columnKey ) ) {
                    include = false;
                } else if ( typeof colFilter.filterTerm === 'string' ) {
                    // default filter action
                    let rowValue = retriever.getValue( r, columnKey );
                    if ( rowValue ) {
                        if ( rowValue.toString().toLowerCase().indexOf( colFilter.filterTerm.toLowerCase() ) === -1 ) {
                            include = false;
                        }
                    } else {
                        if ( colFilter.filterTerm === "?" ) {
                            include = true;
                        } else {
                            include = false;
                        }
                    }
                } else if ( colFilter.filterTerm instanceof Array ) {
                    let rowValue = retriever.getValue( r, columnKey );
                    include = false;
                    for ( let term of colFilter.filterTerm ) {
                        if ( rowValue === term ) {
                            include = true
                            break
                        }
                    }
                }
            } 
        }
        return include;
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
