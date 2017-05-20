import React from "react"
import ReactDataGrid from "react-data-grid"
import ReactDOM from "react-dom"
import $update from "immutability-helper"
import { Editors, Toolbar, Formatters } from "react-data-grid-addons"
import { CancelFormatter, HFIDFormatter, RelsSelectionFormatter, DepnSelectionFormatter, DateFormatter, ConfirmHotfixFormatter, ControlFormatter, DepnControlFormatter, TextFormatter, AddRowControlFormatter } from "./hotfix-tracking-formatter"
import func$ from "./hotfix-tracking-func"
import depn$ from "./hotfix-tracking-func-depn"
import { CustomToolbar } from "./hotfix-tracking-toolbar"
import { Tabs, Tab, ButtonGroup } from "react-bootstrap"
import { Selectors } from "./hotfix-tracking-filter"
import $ from "jquery"
import LoadingOverlay from "react-loading-overlay";
import { TextAreaEditor } from "./hotfix-tracking-editor"
import $dateformat from "dateformat"

class HotfixTrackingDocument extends React.Component {

    initColumns = () => {
        const hfidFormatter = <HFIDFormatter
            onSync={this.setStateOnSyncHotfixInfo}
            onMail={this.openMailClientForDelivery}
            onSee={this.openHotfixInfo}
            />
        this.COLUMNS = {}
        this.COLUMNS.productionDate = {
            key: 'productionDate', name: 'Production', resizable: true, editable: true, filterable: true,
            formatter: <DateFormatter onValueChange={this.setStateOnProductionDateUpdated} isEnabled={this.isProductionDateEnabled} />,
            getRowMetaData: ( row ) => row
        }
        this.COLUMNS.manualDate = {
            key: 'manualDate', name: 'Manual', resizable: true, editable: true, filterable: true,
            formatter: <DateFormatter onValueChange={this.setStateOnManualDateUpdated} isEnabled={this.isManualDateEnabled} />,
            getRowMetaData: ( row ) => row
        }
        this.COLUMNS.confirmDate = {
            key: 'confirmDate', name: 'Ready', resizable: true, editable: true, filterable: true,
            formatter: <ConfirmHotfixFormatter
                onShowForm={this.setStateOnShowConfirmForm}
                onSubmitForm={this.setStateOnSubmitConfirmForm}
                onCancelForm={this.setStateOnCancelConfirmForm}
                isEnabled={this.isConfirmDateEnabled}
                />,
            getRowMetaData: ( row ) => row
        }
        this.COLUMNS.hfid = {
            key: 'hfid', name: `${pageProperties.version}`, resizable: true, editable: true, filterable: true, formatter: hfidFormatter,
            width: 110,
            getRowMetaData: ( row ) => row
        }
        this.COLUMNS.hfid2 = {
            key: 'hfid2', name: `${pageProperties.version}0`, resizable: true, editable: true, filterable: true, formatter: hfidFormatter,
            width: 110,
            getRowMetaData: ( row ) => row
        }
        this.COLUMNS.hfid3 = {
            key: 'hfid3', name: `${pageProperties.version + 1}`, resizable: true, editable: true, filterable: true, formatter: hfidFormatter,
            width: 110,
            getRowMetaData: ( row ) => row
        }
        this.COLUMNS.hfid4 = {
            key: 'hfid4', name: `${pageProperties.version + 1}0`, resizable: true, editable: true, filterable: true, formatter: hfidFormatter,
            width: 110,
            getRowMetaData: ( row ) => row
        }
        this.COLUMNS.creator = { key: 'creator', name: 'Created By', resizable: true, editable: true, filterable: true, formatter: TextFormatter }
        this.COLUMNS.module = { key: 'module', name: 'Module', resizable: true, editable: true, filterable: true }
        this.COLUMNS.version = { key: 'version', name: 'Version', resizable: true, editable: true, filterable: true }
        this.COLUMNS.defectSummary = { key: 'defectSummary', name: 'Summary', width: 200, resizable: true, editable: true, filterable: true, formatter: TextFormatter }
        this.COLUMNS.files = { key: 'files', name: 'Files', width: 100, resizable: true, editable: true, filterable: true, formatter: TextFormatter }
        this.COLUMNS.creationDate = {
            key: 'creationDate', name: 'Created On', resizable: true, editable: true, filterable: true,
            formatter: <DateFormatter onValueChange={this.setStateOnCreationDateUpdated} />,
            getRowMetaData: ( row ) => row
        }
        this.COLUMNS.cancelDate = {
            key: 'cancelDate', name: 'Cancel', resizable: true, editable: true, filterable: true,
            formatter: <CancelFormatter onValueChange={this.setStateOnCancelDateUpdated} />,
            getRowMetaData: ( row ) => row
        }
        this.COLUMNS.control = {
            key: 'control', name: '', resizable: true, width: 50,
            formatter: <ControlFormatter
                onDel={this.deleteRow}
                />,
            getRowMetaData: ( row ) => row
        }

        this.COLUMNS.depnControl = {
            key: "_depn", name: "Dependency Type", width: 150, resizable: false,
            formatter: <DepnControlFormatter
                getDependencyType={this.getDependencyTypeRelativeToSelectedDepnHFID}
                setDependencyType={this.setDependencyTypeRelativeToSelectedDepnHFID} />,
            getRowMetaData: ( row ) => row
        }

        this.COLUMNS.depnSelection = {
            key: "_depnSelect", name: "Depn", width: 50, resizable: false,
            formatter: <DepnSelectionFormatter
                getSelectedHFID={this.getSelectedDepnHFID}
                setSelectedHFID={this.setStateOnSelectDepn} />,
            getRowMetaData: ( row ) => row
        }

        this.COLUMNS.relsSelection = {
            key: "_relsSelect", name: "Rels", width: 50, resizable: false,
            formatter: <RelsSelectionFormatter
                getSelectedHFIDList={this.getSelectedRelsHFIDList}
                addSelectedHFID={this.setStateOnSelectRels} />,
            getRowMetaData: ( row ) => row
        }

        this.COLUMNS.memo = {
            key: 'memo', name: 'Memo', width: 100, resizable: true, editable: true, filterable: true, formatter: TextFormatter,

        }

    }

    getColumnsNormalView = () => {
        let COLUMNS = this.COLUMNS
        return [
            COLUMNS.productionDate,
            COLUMNS.manualDate,
            COLUMNS.confirmDate,
            COLUMNS.hfid,
            COLUMNS.hfid2,
            COLUMNS.hfid3,
            COLUMNS.hfid4,
            COLUMNS.creator,
            COLUMNS.module,
            COLUMNS.defectSummary,
            COLUMNS.creationDate,
            COLUMNS.cancelDate,
            COLUMNS.files,
            COLUMNS.memo,
            COLUMNS.control
        ]
    }

    getColumnsDepnView = () => {
        let COLUMNS = this.COLUMNS
        return [
            COLUMNS.depnSelection,
            COLUMNS.productionDate,
            COLUMNS.manualDate,
            COLUMNS.confirmDate,
            COLUMNS.hfid,
            COLUMNS.depnControl,
            COLUMNS.creator,
            COLUMNS.module,
            COLUMNS.defectSummary,
            COLUMNS.files,
            COLUMNS.cancelDate,
            COLUMNS.memo,
            COLUMNS.control
        ]
    }

    getColumnsRelsView = () => {
        let COLUMNS = this.COLUMNS
        return [
            COLUMNS.relsSelection,
            COLUMNS.depnSelection,
            COLUMNS.productionDate,
            COLUMNS.manualDate,
            COLUMNS.confirmDate,
            COLUMNS.hfid,
            COLUMNS.depnControl,
            COLUMNS.creator,
            COLUMNS.module,
            COLUMNS.defectSummary,
            COLUMNS.files,
            COLUMNS.memo,
            COLUMNS.creationDate
        ]
    }

    getColumns = () => {
        switch ( this.state.view ) {
            case "EDIT":
                return this.getColumnsNormalView()
            case "DEPN":
                return this.getColumnsDepnView()
            case "RELS":
                return this.getColumnsRelsView()
        }
    }

    constructor( props ) {
        super( props )
        this.state = {
            rows: [], dependencies: {}, filters: {}, modal: {}, relsSelectedHFIDs: [], relsReadyHFIDs: [], depnSelectedHFID: null, view: "EDIT",
            helpMessage: <span>Welcome to Hotfix Tracking Docment!!</span>,
            loading: false,
            rowsIndex: []
        }
        this.initColumns()
        this.setStateOnInitTrackingDoc()
    }

    deleteRow = ( row ) => {
        if ( row.hfid ) {
            let rowIdx = this.getRowsIdxByHFID( row.hfid )
            this.setState( { rows: $update( this.state.rows, { $splice: [[rowIdx, 1]] }) })
        } else {
            this.setState( { rows: this.state.rows.filter( row => row.hfid ) })
        }

    }

    setStateUpdateRows = ( updatedRows, otherThings, callback ) => {
        if ( typeof otherThings === "function" ) {
            return this.setStateUpdateRows( updatedRows, {}, otherThings )
        } else if ( !otherThings ) {
            return this.setStateUpdateRows( updatedRows, {})
        }

        if ( !( updatedRows instanceof Array ) ) {
            updatedRows = [updatedRows]
        }
        let rowsCopy = this.state.rows.slice()
        updatedRows.forEach(( row ) => {
            let rowIdx = this.getRowsIdxByHFID( row.hfid )
            row.key = Math.random()
            rowsCopy[rowIdx] = $update( rowsCopy[rowIdx], { $merge: row })
        })
        this.setState( $update( { rows: rowsCopy }, { $merge: otherThings }), () => {
            if ( callback ) {
                callback()
            }
        })

    }

    getRowsIdxByHFID = ( HFID ) => {
        if ( !HFID ) {
            throw new Error( "Invalid HFID : " + HFID )
        }

        let rowIdx = this.rowsIndex[HFID]
        if ( rowIdx && this.state.rows[rowIdx].hfid === HFID ) {
            return rowIdx
        } else {
            this.updateRowsIndex()
            return this.rowsIndex[HFID]
        }
    }

    updateRowsIndex = () => {
        this.rowsIndex = []
        for ( let [i, row] of this.state.rows.entries() ) {
            this.rowsIndex[row.hfid] = i
        }
    }

    getRelsRows = () => {
        return this.state.relsSelectedHFIDs.map( hfid => this.state.rows[this.getRowsIdxByHFID( hfid )] )
    }

    getRows = () => {
        return Selectors.getRows( this.state )
    }

    getRowsSize = () => {
        return this.getRows().length
    }

    getRow = ( usingThisRowIdx ) => {
        let rows = this.getRows()
        return rows[usingThisRowIdx]
    }

    getSelectedDepnHFID = () => {
        return this.state.depnSelectedHFID
    }

    setDependencyTypeRelativeToSelectedDepnHFID = ( HFID, dependencyType ) => {
        let selectedHFID = this.state.depnSelectedHFID
        let selectedRowIdx = this.getRowsIdxByHFID( selectedHFID )
        let dependenciesCopy = this.state.rows[selectedRowIdx].dependencies.slice()
        let depnIdx = dependenciesCopy.findIndex( depn => depn.hfid === HFID )
        if ( depnIdx === -1 ) {
            dependenciesCopy = $update( dependenciesCopy, { $push: [{ hfid: HFID, dependencyType: dependencyType }] })
        } else {
            dependenciesCopy[depnIdx] = $update( dependenciesCopy[depnIdx], { $merge: { dependencyType: dependencyType } })
        }

        this.setStateUpdateRows( {
            hfid: selectedHFID,
            dependencies: dependenciesCopy
        })
    }

    getDependencyTypeRelativeToSelectedDepnHFID = ( HFID ) => {
        let selectedDepnHFID = this.state.depnSelectedHFID
        let selectedRowIdx = this.getRowsIdxByHFID( selectedDepnHFID )
        let depn = this.state.rows[selectedRowIdx].dependencies.find( depn => depn.hfid === HFID )
        if ( depn ) {
            return depn.dependencyType
        } else {
            return "NODEPEND"
        }
    }

    setStateOnSelectDepn = ( HFID ) => {
        let rowIdx = this.getRowsIdxByHFID( HFID )
        let prevSelectedDepnHFID = this.state.depnSelectedHFID
        if ( prevSelectedDepnHFID ) {
            let prevRowIdx = this.getRowsIdxByHFID( prevSelectedDepnHFID )
            let prevDependencies = this.state.rows[prevRowIdx].dependencies
            var refreshPrevHFIDList = prevDependencies.map( depn => ( { hfid: depn.hfid }) )
        } else {
            var refreshPrevHFIDList = []
        }



        if ( this.state.rows[rowIdx].dependencies ) {
            let refreshNewHFIDList = this.state.rows[rowIdx].dependencies.map( depn => ( { hfid: depn.hfid }) )
            this.setState( { depnSelectedHFID: HFID }, () => {
                this.setStateUpdateRows( [...refreshPrevHFIDList, ...refreshNewHFIDList], { loading: false })
            })
        } else {
            this.setState( { loading: true, depnSelectedHFID: HFID }, () => {
                this.analyzeDepn( HFID ).done( dependencies => {
                    let refreshNewHFIDList = dependencies.map( depn => ( { hfid: depn.hfid }) )
                    this.setStateUpdateRows( [
                        { hfid: HFID, dependencies: dependencies },
                        ...refreshPrevHFIDList, ...refreshNewHFIDList
                    ], { loading: false })
                })
            })

        }
    }

    analyzeDepn = ( HFID ) => {
        // find all hotfixes having hfid less than the base hotfix and have not been released to production
        let hfidListToAnalize = this.state.rows
            .filter( row => !row.productionDate && row.hfid <= HFID )
            .map( row => row.hfid )
            .sort(( a, b ) => b - a )

        return func$.analyzeDependencies( hfidListToAnalize )
            .fail( this.setStateOnAJAXError )
            .then( analyzedHFIDList => {
                let dependencies = analyzedHFIDList.map( hfid => ( { hfid: hfid, dependencyType: hfid === HFID ? "SELF" : "UNRESOLVED" }) )
                return dependencies
            })
    }

    setStateEnterDepnView = () => {
        if ( this.state.view === "DEPN" ) {
            return
        }

        this.setState( { loading: true }, () => {
            let rowsCopy = this.state.rows.filter( row => row.hfid !== null && row.hfid !== undefined )
            if ( rowsCopy.length === 0 ) {
                this.setState( { helpMessage: <span>No hotfix! please add some.</span>, loading: false })
                return
            }

            this.setState( { rows: rowsCopy, view: "DEPN", filters: {}, loading: false }, () => {
                this.setStateOnSelectDepn( this.state.depnSelectedHFID )
            })
        })

    }

    setStateOnShowConfirmForm = ( HFID ) => {
    }

    _setStateOnSubmitConfirmForm = ( HFID, sanityDesc, rollbackDesc, deploymentRemark, isRestartRequired, testResult ) => {
        let rowIdx = this.getRowsIdxByHFID( HFID )
        let dependencies = this.state.rows[rowIdx].dependencies
        if ( !dependencies ) {
            this.analyzeDepn( HFID ).done( depns => {
                this.setStateUpdateRows( {
                    hfid: HFID,
                    dependencies: depns
                }, () => {
                    this.setStateOnSubmitConfirmForm( HFID, sanityDesc, rollbackDesc, deploymentRemark, isRestartRequired, testResult )
                })
            })
            return
        }

        let unresolvedDepnList = dependencies.filter( depn => depn.dependencyType === "UNRESOLVED" && !this.state.rows[this.getRowsIdxByHFID( depn.hfid )].productionDate )

        if ( unresolvedDepnList.length > 0 ) {
            let msg = "There is unresolved dependencies for this hotfix, you cannot confirm a hotfix until all of its dependencies are resolved."
            alert( msg )
            this.setState( { helpMessage: <span>{msg}</span> }, () => {
                this.setStateUpdateRows( {
                    hfid: HFID,
                    sanityDesc: sanityDesc,
                    rollbackDesc: rollbackDesc,
                    deploymentRemark: deploymentRemark,
                    isRestartRequired: isRestartRequired,
                }, { depnSelectedHFID: HFID, loading: false }, () => {
                    this.setStateEnterDepnView()
                })
            })
        } else {
            this.setStateUpdateRows( {
                hfid: HFID,
                sanityDesc: sanityDesc,
                rollbackDesc: rollbackDesc,
                deploymentRemark: deploymentRemark,
                isRestartRequired: isRestartRequired,
                confirmDate: new Date().getTime()
            }, { loading: false })
        }
    }
    setStateOnSubmitConfirmForm = ( HFID, sanityDesc, rollbackDesc, deploymentRemark, isRestartRequired, testResult ) =>
        this.setState( { loding: true }, () => {

            let rowIdx = this.getRowsIdxByHFID( HFID )
            let row = this.state.rows[rowIdx]
            if ( testResult && row.testResult !== testResult.id ) {
                func$.putResource( testResult ).done(() => {
                    this.setStateUpdateRows( {
                        hfid: HFID,
                        testResult: testResult.id
                    }, () => {
                        this._setStateOnSubmitConfirmForm( HFID, sanityDesc, rollbackDesc, deploymentRemark, isRestartRequired, testResult )
                    })
                }).fail(() => {
                    alert( "Failed to upload file." )
                    this._setStateOnSubmitConfirmForm( HFID, sanityDesc, rollbackDesc, deploymentRemark, isRestartRequired, testResult )
                })
            } else {
                this._setStateOnSubmitConfirmForm( HFID, sanityDesc, rollbackDesc, deploymentRemark, isRestartRequired, testResult )
            }
        })

    setStateOnCancelConfirmForm = ( HFID, sanityDesc, rollbackDesc, deploymentRemark, isRestartRequired, testResult ) => {
        this.setStateUpdateRows( {
            hfid: HFID,
            sanityDesc: sanityDesc,
            rollbackDesc: rollbackDesc,
            deploymentRemark: deploymentRemark,
            isRestartRequired: isRestartRequired,
        })
    }

    setStateOnAJAXError = ( err ) => {
        try {
            var message = JSON.parse( err.responseText ).message
        } catch ( e ) {
            var message = err.responseText
            console.log( err )
        }
        this.setState( { loading: false, helpMessage: <span className="alert">{message}</span> })
    }

    setStateSortRowsByCreationDate = () => {
        this.setState( { loading: true }, () => {
            let rowsCopy = this.state.rows.slice()
            rowsCopy.sort(( r1, r2 ) => {
                if ( r1.creationDate === null && r2.creationDate === null ) {
                    return 0
                } else if ( r1.creationDate === null ) {
                    return -1
                } else if ( r2.creationDate === null ) {
                    return 1
                } else {
                    return r2.creationDate - r1.creationDate
                }
            })
            this.setState( { rows: rowsCopy, loading: false })
        })
    }

    isProductionDateEnabled = ( row ) => {
        return !row.cancelDate && row.hfid
    }

    isManualDateEnabled = ( row ) => {
        return !row.cancelDate && row.hfid
    }

    isConfirmDateEnabled = ( row ) => {
        return !row.cancelDate && row.hfid
    }

    setStateOnProductionDateUpdated = ( HFID, productionDateValue ) => {
        this.setStateUpdateRows( {
            hfid: HFID,
            productionDate: productionDateValue
        })
    }

    setStateOnManualDateUpdated = ( HFID, manualDateValue ) => {
        this.setStateUpdateRows( {
            hfid: HFID,
            manualDate: manualDateValue
        })
    }

    setStateOnCreationDateUpdated = ( HFID, creationDateValue ) => {
        this.setStateUpdateRows( {
            hfid: HFID,
            creationDate: creationDateValue
        })
    }

    setStateOnCancelDateUpdated = ( HFID, cancelDateValue ) => {
        this.setStateUpdateRows( {
            hfid: HFID,
            cancelDate: cancelDateValue
        })
    }

    setStateOnInitTrackingDoc = () => {
        return func$.promiseGetTrackingDocData( pageProperties.version, pageProperties.documentID ).done( trackingDoc => {
            this.trackingDoc = trackingDoc
            if ( trackingDoc.hotfixList.length > 0 ) {
                this.setState( { rows: trackingDoc.hotfixList }, () => {
                    this.updateRowsIndex()
                    this.setStateOnSelectDepn( trackingDoc.hotfixList[0].hfid )
                })
            } else {
                this.setState( { helpMessage: <span>Document is empty, use <b>Sync Settings</b> and <b>Sync Hotfix</b> to get some list.</span> })
            }
        }).fail( this.setStateOnAJAXError )
    }

    setStateOnSyncHotfixInfo = ( HFID, rowIdx ) => {
        this.setState( { loading: true }, () => {
            func$.promiseGetHotfixInfo( HFID, pageProperties.version ).done( hotfixInfo => {
                let rowsCopy = this.state.rows.slice()
                rowsCopy[rowIdx] = $update( rowsCopy[rowIdx], {
                    $merge: {
                        hfid: HFID,
                        creator: hotfixInfo.creator,
                        module: hotfixInfo.module,
                        version: hotfixInfo.version,
                        defectSummary: hotfixInfo.defectSummary,
                        creationDate: hotfixInfo.creationDate,
                        instruction: hotfixInfo.instruction,
                        files: hotfixInfo.files,
                        rtNumber: hotfixInfo.rtNumber,
                        location: hotfixInfo.location
                    }
                })
                this.setState( {
                    rows: rowsCopy, loading: false, helpMessage: (
                        <span>Successfuly!! You can use control buttons
                        to <span className=" glyphicon glyphicon-eye-open" /> file details,
                        send <span className=" glyphicon glyphicon-envelope" /> delivery to VM
                        or <span className=" glyphicon glyphicon-trash" /> a row.</span>
                    )
                })

            }).fail( this.setStateOnAJAXError )
        })
    }

    setStateOnGridRowsUpdated = ( { fromRow, toRow, updated }) => {

        if ( updated.hfid ) {
            if ( fromRow !== toRow ) {
                alert( "You are trying to update multiple rows with the same primary HFID, please don't." )
                this.setState( { loading: false, helpMessage: <span>You are trying to update multiple rows with the same primary HFID, <b>please don&#39;t</b></span> })
                return
            }
            if ( Object.keys( this.state.filters ).length !== 0 ) {
                alert( "Cannot add rows while on filters." )
                this.setState( { loading: false, helpMessage: <span>Cannot add rows while on filters.</span> })
                return
            }
            let hfid = updated.hfid
            let r = this.getRowsIdxByHFID( hfid )
            if ( r || r === 0 ) {
                this.setState( { loading: false, helpMessage: <span>HFID {hfid} already exists!</span> })
                return
            }

            this.setStateOnSyncHotfixInfo( hfid, fromRow )

        } else {
            for ( let [key, val] of Object.entries( updated ) ) {
                if ( key.match( /.*Date/ ) ) {
                    if ( !val ) {
                        continue
                    }
                    let t = parseInt( val )
                    let d = new Date( t )
                    if ( isNaN( d.getTime() ) ) {
                        alert( "You enter an invalid date." )
                        return
                    } else {
                        updated[key] = t
                    }
                } else if ( key.match( /hfid.*/ ) ) {
                    if ( !val ) {
                        continue
                    }

                    if ( isNaN( val ) ) {
                        alert( "You enter an invalid number" )
                        return
                    }
                }
            }

            let updatedList = []
            for ( let i = fromRow; i <= toRow; i++ ) {
                updatedList.push( $update( updated, { $merge: { hfid: this.getRow( i ).hfid } }) )
            }
            this.setStateUpdateRows( updatedList )
        }
    }

    setStateOnAddRow = () => {
        if ( Object.keys( this.state.filters ).length !== 0 ) {
            alert( "Cannot add rows while on filters." )
            this.setState( { loading: false, helpMessage: <span>Cannot add rows while on filters.</span> })
            return
        }

        this.setState( {
            rows: $update( this.state.rows, {
                $unshift: [{
                    hfid: null,
                    creator: null,
                    module: null,
                    version: null,
                    defectSummary: null,
                    creationDate: null,
                    dependencies: []
                }]
            }),
            helpMessage: <span>Try enter the primary HFID, I will <b>automatically fill in the details</b>.</span>
        })
    }

    setStateOnFilterChange = ( filter ) => {
        let filtersCopy = Object.assign( {}, this.state.filters )
        if ( filter.filterTerm ) {
            filtersCopy[filter.column.key] = filter
        } else {
            delete filtersCopy[filter.column.key]
        }
        this.setState( { filters: filtersCopy })
    }

    setStateOnClearFilters = () => {
        this.setState( { filters: {} })
    }

    setStateEnterEditView = () => {
        if ( this.state.view === "EDIT" ) {
            return
        }
        this.setState( { filters: {}, view: "EDIT" })
    }

    setStateEnterRelsView = () => {
        if ( this.state.view === "RELS" ) {
            return
        }

        this.setState( { loading: true }, () => {
            let readyHFIDList = this.state.rows.filter( row => !row.productionDate && row.confirmDate ).map( row => row.hfid )

            if ( readyHFIDList.length === 0 ) {
                alert( "No ready hotfix!" )
                this.setState( { loading: false, helpMessage: <span>No ready hotfix!</span> })
                return
            }

            let otherDepnHFIDList = readyHFIDList
                .map( readyHFID => this.state.rows[this.getRowsIdxByHFID( readyHFID )].dependencies )
                .filter( dependencies => dependencies && dependencies.length > 0 )
                .reduce(( acc, dependencies ) => acc.concat( dependencies ), [] )
                .filter( depn => depn.dependencyType === "REPLACED" || depn.dependencyType === "TOGETHER" || depn.dependencyType === "UNRESOLVED" )
                .map( depn => depn.hfid )
                .filter( hfid => !readyHFIDList.includes( hfid ) )
            let allReadyHFIDList = [...readyHFIDList, ...otherDepnHFIDList]
            let tobeReleaseHFIDList = allReadyHFIDList.slice()
            this.setState( {
                view: "RELS",
                relsReadyHFIDs: allReadyHFIDList,
                relsSelectedHFIDs: tobeReleaseHFIDList,
                filters: {
                    hfid: {
                        filterTerm: allReadyHFIDList,
                        column: this.COLUMNS.hfid
                    }
                }
            }, () => {
                this.setStateUpdateRows( tobeReleaseHFIDList.map( hfid => ( { hfid: hfid }) ), () => {
                    this.setStateOnSelectDepn( this.state.depnSelectedHFID )
                })
            })
        })

    }

    getSelectedRelsHFIDList = () => {
        return this.state.relsSelectedHFIDs
    }

    setStateOnSelectRels = ( HFID ) => {

        if ( this.state.relsSelectedHFIDs.includes( HFID ) ) {
            this.setState( { relsSelectedHFIDs: this.state.relsSelectedHFIDs.filter( hfid => hfid !== HFID ) }, () => {
                this.setStateUpdateRows( {
                    hfid: HFID,
                    productionDate: null
                })
            })
        } else {
            let relsRowsWithProductionDate = this.state.relsReadyHFIDs.map( hfid => this.state.rows[this.getRowsIdxByHFID( hfid )] ).filter( row => row.productionDate )
            if ( relsRowsWithProductionDate.length > 0 ) {
                var productionDateValue = relsRowsWithProductionDate[0].productionDate
            } else {
                var productionDateValue = null
            }
            this.setState( { relsSelectedHFIDs: $update( this.state.relsSelectedHFIDs, { $push: [HFID] }) }, () => {
                this.setStateUpdateRows( {
                    hfid: HFID,
                    productionDate: productionDateValue
                })
            })
        }
    }

    setStateOnSyncSettingsSaved = ( moduleInput, filenameInput, summaryInput, amdocsHFInput, trueHFInput ) => {
        this.trackingDoc.syncSettings = $update( this.trackingDoc.syncSettings, {
            $merge: {
                module: moduleInput ? moduleInput.split( /[\s,]+/ ) : null,
                filenameKeyword: filenameInput ? filenameInput : null,
                dfSummaryKeyword: summaryInput ? summaryInput : null,
                includeTrueHF: trueHFInput,
                includeAmdocsHF: amdocsHFInput
            }
        })
    }

    setStateOnSyncHotfix = () => {
        let rows = this.state.rows.slice().sort(( a, b ) => b.creationDate - a.creationDate )
        let latestHFID = null
        if ( rows.length > 0 ) {
            latestHFID = rows[0].hfid
        }

        this.trackingDoc.syncSettings = $update( this.trackingDoc.syncSettings, {
            $merge: {
                hfidafter: latestHFID
            }
        })
        this.setState( { loading: true }, () => {
            func$.searchHotfix( this.trackingDoc.version, this.trackingDoc.syncSettings ).done( hotfixInfoList => {
                console.log( hotfixInfoList )
                this.setState( { loading: false, rows: $update( this.state.rows, { $unshift: hotfixInfoList }) })
            }).fail( this.setStateOnAJAXError )
        })

    }

    saveTrackingDoc = () => {
        this.trackingDoc = $update( this.trackingDoc, {
            $merge: {
                hotfixList: this.state.rows.slice()
            }
        })
        let newUpdateStamp = new Date().getTime()
        this.setState( { loading: true }, () => {
            func$.promiseGetTrackingDocData( pageProperties.version, pageProperties.documentID ).done( doc => {
                if ( doc.updateStamp === this.trackingDoc.updateStamp ) {
                    this.trackingDoc.updateStamp = newUpdateStamp
                    func$.saveTrackingDoc( this.trackingDoc ).done(( x ) => {
                        this.setState( { loading: false, helpMessage: <span>Saved successfully!!</span> })
                    }).fail( this.setStateOnAJAXError )
                } else {
                    alert( "Your data is out dated, someone has updated the data before you!" )
                    this.setState( { loading: false, helpMessage: <span>Saving failed! Your data is out dated, someone has updated the data before you!</span> })
                }
            })

        })
    }

    openHotfixInfo = ( HFID, row ) => {
        func$.getHotfixInfoURL( HFID, row.version ).done( url => {
            let win = window.open( url, "_blank" );
            if ( !win ) {
                alert( "Please allow pop-up" )
            } else {
                win.focus()
            }
        })
    }

    openMailClientForDelivery = ( HFID, column, row ) => {
        console.log( row )
        func$.getMailClient( {
            subject: `Hotfix Delivery HF${HFID} V${column.name}, Module ${row.module}, Defect: ${row.defectSummary}`,
            mailto: ["ccb-bdv-vm@truecorp.co.th"],
            mailcc: [],
            senderName: "HFX",
            mailBody: `<h3>Dear VM,</h3>
            <p>Please approve to deliver <b>HF${HFID}</b> for Defect <b>${row.defectSummary}</b> to UAT <b>V${row.version}</b></p>
            <table border="1" cellspacing="0" cellpadding="5">
            <tr>
            <th>HF</th>
            <td>${HFID}</td>
            </tr>
            
            <tr>
            <th>Module</th>
            <td>${row.module}</td>
            </tr>
            
            <tr>
            <th>Version</th>
            <td>${row.version}</td>
            </tr>
            
            <tr>
            <th>Site QC updated to 'Deliver_to_CC'?</th>
            <td>Yes</td>
            </tr>
            
            <tr>
            <th>HF ID is updated on the defect?</th>
            <td>Yes</td>
            </tr>
            
            <tr>
            <th>Location for manual deployment add to HF instructions</th>
            <td><pre>${row.instruction}</pre></td>
            </tr>
            
            <tr>
            <th>HF Location</th>
            <td>${row.location}</td>
            </tr>
            
            <tr>
            <th>Auto deploy</th>
            <td>${row.canAutoDeploy}</td>
            </tr>
            
            <tr>
            <th>RT request</th>
            <td>${row.rtNumber}</td>
            </tr>
            
            </table>
            
            `,
            attachements: []
        }).done( html => {
            let win = window.open( "about:blank", "Deliver Hotfix", "height=500,width=800" );
            if ( !win ) {
                alert( "Please allow pop-up" )
            } else {
                win.document.open()
                win.document.write( html )
                win.document.close()
            }
        })
    }

    openMailClientForConfirmRelease = () => {

        let prdDateList = this.getRelsRows()
            .filter( row => row.productionDate )
            .map( row => row.productionDate )
            .filter(( v, i, a ) => a.indexOf( v ) === i ) // filter distinct
            .map( productionDate => $dateformat( new Date( productionDate ), "dd mmm yyyy" ) )

        if ( prdDateList.length > 0 ) {
            var productionDate = prdDateList.join( ", " )
        } else {
            var productionDate = "[Production Date]"
        }

        let attachements = this.getRelsRows().filter( row => row.testResult ).map( row => row.testResult )

        func$.getMailClient( {
            subject: `Confirm Hotfix Version ${this.trackingDoc.version} to deploy on production on ${productionDate}`,
            mailto: ["ccb-bdv-vm@truecorp.co.th"],
            mailcc: [],
            senderName: "HFX",
            mailBody: this.getMailRelaseContent( productionDate ),
            attachements: attachements
        }).done( html => {
            let win = window.open( "about:blank", "Release Hotfix", "height=500,width=800" );
            if ( !win ) {
                alert( "Please allow pop-up" )
            } else {
                win.document.open()
                win.document.write( html )
                win.document.close()
            }
        })
    }

    getMailRelaseContent = ( productionDate ) => {
        let relsRows = this.getRelsRows().filter( row => row.productionDate )

        let depnList = relsRows
            .map( row =>
                !row.dependencies ? [] :
                    row.dependencies.map( depn => ( { hfid: depn.hfid, dependencyType: depn.dependencyType, baseHFID: row.hfid }) )
            )
            .reduce(( acc, depnList ) => acc.concat( depnList ), [] )

        let replacedDepnList = depnList
            .filter( depn => depn.dependencyType === "REPLACED" )
            .map( depn => ( { hfid: depn.hfid, baseHFID: depn.baseHFID }) )

        let togetherDepnList = depnList
            .filter( depn => depn.dependencyType === "TOGETHER" )
            .map( depn => ( { hfid: depn.hfid, baseHFID: depn.baseHFID }) )

        let replacedRows = []
        let togetherRows = []
        let confirmedRows = []
        for ( let row of relsRows ) {

            let replacedByHFIDs = replacedDepnList.filter( depn => depn.hfid === row.hfid ).map( depn => depn.baseHFID )
            if ( replacedByHFIDs.length > 0 ) {
                row._replacedByHFIDs = replacedByHFIDs
                replacedRows.push( row )
                continue
            }

            let togetherWithHFIDs = togetherDepnList.filter( depn => depn.hfid === row.hfid ).map( depn => depn.baseHFID )
            if ( togetherWithHFIDs.length > 0 ) {
                row._togetherWithHFIDs = togetherWithHFIDs
                togetherRows.push( row )
                continue
            }

            confirmedRows.push( row )
        }

        return `<h3>Dear VM,</h3>
        <p>Please add following hotfixes to the production deployment plan on date <b>${productionDate}</b> </p>
        ${this.confirmedTable( confirmedRows, togetherRows )}
        <p>Note: following has been replaced by the above list</p>
        ${this.replacedTable( replacedRows )}
        `
    }

    replacedTable = ( replacedRows ) => {
        let rs = `<table border="1" cellspacing="0" cellpadding="5">
        <thead>
        <tr>
        <th>HFID</th>
        <th>Restart?</th>
        <th>Module</th>
        <th>Created By</th>
        <th>Summary</th>
        <th>Replaced By HFID</th>
        </tr>
        </thead>
        <tbody>`
        for ( let row of replacedRows ) {
            rs += `<tr>
            <td>${row.hfid}</td>
            <td>${row.isRestartRequired ? "YES" : "NO"}</td>
            <td>${row.module}</td>
            <td>${row.creator}</td>
            <td>${row.defectSummary}</td>
            <td>${row._replacedByHFIDs.toString()}</td>
            </tr>`
        }
        rs += `</tbody>
        </table>`

        return rs
    }

    confirmedTable = ( confirmedRows, togetherRows ) => {
        let rs = `<table border="1" cellspacing="0" cellpadding="5">
        <thead>
        <tr>
        <th>Production Date</th>
        <th>HFID</th>
        <th>Restart?</th>
        <th>Module</th>
        <th>Created By</th>
        <th>Summary</th>
        <th>Has Some Files Replaced By HFID</th>
        <th>Exclude Files</th>
        <th>Include Files</th>
        <th>Deployment Remark</th>
        <th>Sanity Test Desc</th>
        <th>Rollback Desc</th>
        </tr>
        </thead>
        <tbody>`
        for ( let row of confirmedRows ) {
            rs += `<tr>
            <td>${row.productionDate ? $dateformat( new Date( row.productionDate ), "dd mmm yyyy" ) : ""}</td>
            <td>${row.hfid}</td>
            <td>${row.isRestartRequired ? "YES" : "NO"}</td>
            <td>${row.module}</td>
            <td>${row.creator}</td>
            <td>${row.defectSummary}</td>
            <td>None</td>
            <td>None</td>
            <td>All</td>
            <td>${row.deploymentRemark}</td>
            <td>${row.sanityDesc}</td>
            <td>${row.rollbackDesc}</td>
            </tr>`
        }
        for ( let row of togetherRows ) {
            rs += `<tr>
            <td>${row.productionDate ? $dateformat( new Date( row.productionDate ), "dd mmm yyyy" ) : ""}</td>
            <td>${row.hfid}</td>
            <td>${row.needRestart}</td>
            <td>${row.module}</td>
            <td>${row.creator}</td>
            <td>${row.defectSummary}</td>
            <td>${row._togetherWithHFIDs.toString()}</td>
            <td>[Filename] as replaced by [HFID]<br/>...</td>
            <td>[Filename]<br/>...</td>
            <td>${row.deploymentRemark}</td>
            <td>${row.sanityDesc}</td>
            <td>${row.rollbackDesc}</td>
            </tr>`
        }
        rs += `</tbody>
        </table>`

        return rs
    }

    syncInfoAll = () => {
        this.state.rows.forEach( row => {
            this.setStateOnSyncHotfixInfo( row.hfid );
        })
    }

    toCSV = () => {
        let header = [
            "hfid",
            "hfid2",
            "hfid3",
            "hfid4",
            "version",
            "creator",
            "defectSummary",
            "module",
            "creationDate",
            "confirmDate",
            "manualDate",
            "productionDate",
            "cancelDate",
            "sanityDesc",
            "rollbackDesc",
            "deploymentRemark",
            "isRestartRequired",
            "location",
            "instruction",
            "canAutoDeploy",
            "rtNumber",
            "files",
            "memo",
            "testResult"
        ]

        let content = "data:text/csv;charset=utf-8," + header.map( field => {
            switch ( field ) {
                case "hfid": return `${pageProperties.version}`
                case "hfid2": return `${pageProperties.version}0`
                case "hfid3": return `${pageProperties.version + 1}`
                case "hfid4": return `${pageProperties.version + 1}0`
                default: return field
            }
        }).join( "," ) + "\r\n" + this.state.rows.map( row => {
            return header.map( field => {
                if ( field.match( /.*Date/ ) ) {
                    return row[field] ? `"${$dateformat( new Date( row[field] ), "dd mmm yyyy" )}"` : null
                } else if ( field.match( /hfid.*/ ) ) {
                    return row[field] ? row[field] : null
                } else {
                    return row[field] ? `"${row[field]}"` : null
                }
            }).join( "," )
        }).join( "\r\n" )
        content = encodeURI( content )
        let link = document.createElement( "a" );
        link.setAttribute( "href", content );
        link.setAttribute( "download", pageProperties.documentID + ".csv" );
        document.body.appendChild( link ); // Required for FF
        link.click();
    }

    render = () => {
        //        minHeight={$( ".react-grid-Row" ).first().height() * this.getRowsSize() + 200}
        return (
            <div>
                <LoadingOverlay active={this.state.loading} text={"Loading..."} spinner background="rgba(57, 204, 204, 0.5)" >
                    <input type="hidden" id="syncInfoAllButton" onClick={this.syncInfoAll} />
                    <ReactDataGrid
                        ref={ele => this.grid = ele}
                        enableCellSelect={true}
                        columns={this.getColumns()}
                        rowGetter={this.getRow}
                        rowsCount={this.getRowsSize()}
                        minHeight={600}
                        onGridRowsUpdated={this.setStateOnGridRowsUpdated}
                        toolbar={
                            <CustomToolbar
                                onClickEditView={this.setStateEnterEditView}
                                onClickDepnView={this.setStateEnterDepnView}
                                onClickRelsView={this.setStateEnterRelsView}
                                onClickRelsConfirm={this.setStateConfirmRels}
                                rows={this.state.rows.slice()}
                                getRelsRows={this.getRelsRows}
                                onMail={this.openMailClientForConfirmRelease}
                                onAddRow={this.setStateOnAddRow}
                                onSort={this.setStateSortRowsByCreationDate}
                                onSyncSettingsSaved={this.setStateOnSyncSettingsSaved}
                                onSync={this.setStateOnSyncHotfix}
                                onSave={this.saveTrackingDoc}
                                editMode={this.state.view === "EDIT"}
                                depnMode={this.state.view === "DEPN"}
                                relsMode={this.state.view === "RELS"}
                                enableAddRow={this.state.view === "EDIT"}
                                enableFilter={true}
                                enableSort={this.state.view === "EDIT"}
                                trackingDoc={this.trackingDoc}
                                helpMessage={() => this.state.helpMessage}
                                toCSV={this.toCSV} />
                        }
                        onAddFilter={this.setStateOnFilterChange}
                        onClearFilters={this.setStateOnClearFilters}
                        />
                </LoadingOverlay>
            </div>
        )

    }
}

// enable React Devtools
if ( typeof window !== 'undefined' ) {
    window.React = React
}

ReactDOM.render(
    <HotfixTrackingDocument />,
    document.getElementById( 'react' )
)