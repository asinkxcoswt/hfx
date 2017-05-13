import $ from "jquery"
import $update from "immutability-helper"

function updateRowsOnDepnSelected( rowsCopy, selectedRowIdx, prevSelectedRowIdx ) {
    if ( selectedRowIdx === prevSelectedRowIdx ) {
        return $.when( rowsCopy )
    }
    updateRowsClearDepn( rowsCopy, prevSelectedRowIdx )
    return promiseUpdateRowsAnalyzeDepnIfRequired( rowsCopy, selectedRowIdx ).done(( rowsCopy2 ) => {
        updateRowsSetDepn( rowsCopy2, selectedRowIdx )
        return rowsCopy2
    })
}

function updateRowsClearDepn( rows, basedOnRowIdx ) {
    if ( basedOnRowIdx ) {
        let baseRow = rows[basedOnRowIdx]
        for ( let depn of baseRow.dependencies ) {
            let i = rows.findIndex( row => row.hfid === depn.hfid )
            rows[i] = $update( rows[i], { $merge: { _depn: null } })
        }
        rows[basedOnRowIdx] = $update( rows[basedOnRowIdx], { $merge: { _depnSelect: false } })
    } else {
        for ( let [i, row] of rows.entries() ) {
            rows[i] = $update( row, { $merge: { _depn: null, _depnSelect: false } })
        }
    }
}

function updateRowsSetDepn( rows, baseRowIdx ) {

    let baseRow = rows[baseRowIdx]

    for ( let depn of baseRow.dependencies ) {
        let i = rows.findIndex( row => row.hfid === depn.hfid )
        rows[i] = $update( rows[i], {
            $merge: {
                _depn: depn.dependencyType
            }
        })
    }

    rows[baseRowIdx] = $update( rows[baseRowIdx], { $merge: { _depnSelect: true } })
}

function promiseUpdateRowsAnalyzeDepnIfRequired( rows, targetRowIdx ) {
    let targetRow = rows[targetRowIdx]
    // analyze dependencies if not already did
    // any row that has already analyzed will have dependencies.length >= 1, (i.e. it at least depends on itself)
    if ( targetRow.dependencies.length === 0 ) {
        return promiseAnalyzePossibleDependencies( rows, targetRowIdx ).then( dependentHFIDList => {
            let newDepn = dependentHFIDList
                .map( hfid => ( { hfid: hfid, dependencyType: hfid === targetRow.hfid ? "SELF" : "UNRESOLVED" }) )
            targetRow.dependencies = $update( targetRow.dependencies, { $merge: newDepn })
            return rows
        })
    } else {
        return $.when( rows )
    }
}

function promiseAnalyzePossibleDependencies( rows, baseRowIdx ) {

    let baseRow = rows[baseRowIdx]

    // find all hotfixes having hfid less than the base hotfix and have not been released to production
    let hfidListToAnalize = rows
        .filter( row => !row.productionDate && row.hfid < baseRow.hfid )
        .map( row => row.hfid )
        .sort(( a, b ) => b - a )

    // add the base hotfix as the first element to analyze
    hfidListToAnalize.unshift( baseRow.hfid )

    return $.ajax( {
        url: "/apis/hotfix-dependency/763",
        data: { hfid: hfidListToAnalize },
        method: "GET",
        dataType: "json"
    }).fail( err => {
        alert( err )
    })
}

function updateRowsSetDepnType( rowsCopy, onRowIdx, forBaseRowIdx, withDepnTypeValue ) {
    let rows = rowsCopy

    // baseRow is the selected hotfix
    let baseRowIdx = forBaseRowIdx
    let baseRow = rows[baseRowIdx]
    let baseDepnList = baseRow.dependencies.slice()

    // targetRow is the row in which the 'dependencyType to the baseRow' was changed
    let targetRowIdx = onRowIdx
    let targetRow = rows[targetRowIdx]

    // find if the target hotfix is already in the dependency list of the base hotfix
    let depnIdx = baseDepnList.findIndex( depn => depn.hfid === targetRow.hfid )


    if ( depnIdx === -1 ) {
        // if not, push the target hotfix to the dependency list
        baseDepnList = $update( baseDepnList, {
            $push: [{
                hfid: targetRow.hfid, dependencyType: withDepnTypeValue
            }]
        })
    } else {
        // if so, update its dependencyType
        baseDepnList[depnIdx] = $update( baseDepnList[depnIdx], {
            $merge: {
                dependencyType: withDepnTypeValue
            }
        })
    }

    // merge the dependencyList back to the baseRow
    rows[baseRowIdx] = $update( rows[baseRowIdx], {
        $merge: {
            dependencies: baseDepnList,
            _depn: "SELF"
        }
    })

    // update dependencyType in control field _depn of the targetRow
    rows[targetRowIdx] = $update( rows[targetRowIdx], {
        $merge: {
            _depn: withDepnTypeValue
        }
    })
}

export default {
    updateRowsClearDepn,
    updateRowsSetDepn,
    promiseUpdateRowsAnalyzeDepnIfRequired,
    promiseAnalyzePossibleDependencies,
    updateRowsSetDepnType,
    updateRowsOnDepnSelected
}