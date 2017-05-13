import { Row, Col, Alert, Modal, Button, FormGroup, ControlLabel, Form, FormControl, HelpBlock, Tabs, Tab, ButtonGroup, Table, Checkbox, Panel } from "react-bootstrap"
import { Toolbar } from "react-data-grid-addons"
import $update from "immutability-helper"
import React from "react"
import TinyMCE from 'react-tinymce'
import $dateformat from "dateformat"
import PieChart from "react-svg-piechart"

export default class SummaryChart extends React.Component {
    state = {
        expandedSector: null,
    }

    handleMouseEnterOnSector = sector => this.setState( { expandedSector: sector })

    render() {
        let newCount = this.props.newCount
        let readyCount = this.props.readyCount
        let manualCount = this.props.manualCount

        let mergeCurrentV0Count = this.props.mergeCurrentV0Count
        let mergeNextCount = this.props.mergeNextCount
        let mergeNextV0Count = this.props.mergeNextV0Count

        let allCount = this.props.allCount

        const dataLegend = [
            { label: 'New Hotfix', value: newCount, color: '#3b5998' },
            { label: 'Ready To Release', value: readyCount, color: '#00aced' },
            { label: 'Manual Pending Production', value: manualCount, color: '#cb2027' },
        ]

        const data = dataLegend.filter( item => item.value > 0 )

        const otherLegend = [
            { label: `Pending Merge ${pageProperties.version}0`, value: mergeCurrentV0Count, color: 'grey' },
            { label: `Pending Merge ${pageProperties.version + 1}`, value: mergeNextCount, color: 'grey' },
            { label: `Pending Merge ${pageProperties.version + 1}0`, value: mergeNextV0Count, color: 'grey' }
        ]

        const { expandedSector } = this.state

        return (
            <div>
                <Row >
                    <Col smOffset={4} sm={4} className="text-right">
                        <div style={{ width: "350px" }}>
                            <PieChart
                                data={data}
                                expandedSector={expandedSector}
                                onSectorHover={this.handleMouseEnterOnSector}
                                sectorStrokeWidth={2}
                                expandOnHover
                                />
                        </div>
                    </Col>
                    <Col sm={4} className="text-left " style={{ transform: "translateY(60%)" }}>
                        <span>
                            <div>
                                <span style={{ color: "white" }} className="glyphicon glyphicon-stop"></span>
                                &nbsp;
                                <span>
                                    All Hotfix : {allCount}
                                </span>
                            </div>
                            {
                                dataLegend.map(( element, i ) => (
                                    <div key={i}>
                                        <span style={{ color: element.color }} className="glyphicon glyphicon-stop"></span>
                                        &nbsp;
                                        <span style={{ fontWeight: this.state.expandedSector === i ? 'bold' : null }}>
                                            {element.label} : {element.value}
                                        </span>
                                    </div>
                                ) )
                            }
                            {
                                otherLegend.map(( element, i ) => (
                                    <div key={i}>
                                        <span style={{ color: element.color }} className="glyphicon glyphicon-stop"></span>
                                        &nbsp;
                                        <span >
                                            {element.label} : {element.value}
                                        </span>
                                    </div>
                                ) )
                            }
                        </span>
                    </Col>
                </Row>
            </div >
        )
    }
}

export class CustomToolbar extends Toolbar {

    static defaultProps = $update( Toolbar.defaultProps, {
        $merge: {
            onClickRelsView: () => console.log( "onClickRelsView" ),
            onClickRelsConfirm: () => console.log( "onClickRelsConfirm" ),
            onClickDepnView: () => console.log( "onClickDepnView" ),
            onClickEditView: () => console.log( "onClickEditView" ),
            onSort: () => console.log( "onSort" ),
            helpMessage: () => "This is your help message.",
            editMode: true,
            depnMode: false,
            relsMode: false,
            showSyncSettings: false
        }
    })

    constructor( props ) {
        super( props )
        this.state = { showRelsEditor: false, showChart: true }
    }

    onRelsClick = () => {
        this.props.onClickRelsView()
    }
    onRelsSendMail = () => {
        this.props.onMail()
    }
    onDepnClick = () => {
        this.setState( { showRelsEditor: false }, () => {
            this.props.onClickDepnView()
        })
    }
    onEditClick = () => {
        this.setState( { showRelsEditor: false }, () => {
            this.props.onClickEditView()
        })
    }

    onSyncSettings = () => {
        if ( this.state.showSyncSettings ) {
            let moduleInput = this.syncSettingModuleInput.value
            let filenameInput = this.syncSettingFilenameInput.value
            let summaryInput = this.syncSettingSummaryInput.value
            let amdocsHFInput = this.syncSettingAmdocsHFInput.checked
            let trueHFInput = this.syncSettingTrueHFInput.checked

            this.setState( { showSyncSettings: false }, () => {
                this.props.onSyncSettingsSaved( moduleInput, filenameInput, summaryInput, amdocsHFInput, trueHFInput )
            })
        } else {
            this.setState( { showSyncSettings: true })
        }
    }

    onChart = () => {
        if ( this.state.showChart ) {
            this.setState( { showChart: false })
        } else {
            this.setState( { showChart: true })
        }
    }

    onSave = () => {
        this.props.onSave()
    }

    renderSettings = () => {
        let trackingDoc = this.props.trackingDoc;
        return (
            <Alert bsStyle="danger">
                <Form horizontal>
                    <FormGroup>
                        <Col componentClass={ControlLabel} sm={5}>
                            Module
                        </Col>
                        <Col sm={5}>
                            <FormControl inputRef={ele => this.syncSettingModuleInput = ele} type="text" placeholder="AR, Collection, BL (can put multiple values separated by commas)" defaultValue={trackingDoc.syncSettings.module ? trackingDoc.syncSettings.module.join( "," ) : null} />
                        </Col>
                    </FormGroup>
                    <FormGroup>
                        <Col componentClass={ControlLabel} sm={5}>
                            Filename
                        </Col>
                        <Col sm={5}>
                            <FormControl inputRef={ele => this.syncSettingFilenameInput = ele} type="text" placeholder="Filename Keyword (case insensitive)" defaultValue={trackingDoc.syncSettings.filenameKeyword} />
                        </Col>
                    </FormGroup>
                    <FormGroup>
                        <Col componentClass={ControlLabel} sm={5}>
                            Defect Summary
                        </Col>
                        <Col sm={5}>
                            <FormControl inputRef={ele => this.syncSettingSummaryInput = ele} type="text" placeholder="Defect Summary Keyword (case insensitive)" defaultValue={trackingDoc.syncSettings.dfSummaryKeyword} />
                        </Col>
                    </FormGroup>
                    <FormGroup>
                        <Col smOffset={5} sm={5} className="text-left">
                            <Checkbox defaultChecked={trackingDoc.syncSettings.includeAmdocsHF} inputRef={ele => this.syncSettingAmdocsHFInput = ele}><b>Include Amdocs Hotfix</b></Checkbox>
                        </Col>
                    </FormGroup>
                    <FormGroup>
                        <Col smOffset={5} sm={5} className="text-left">
                            <Checkbox defaultChecked={trackingDoc.syncSettings.includeTrueHF} inputRef={ele => this.syncSettingTrueHFInput = ele}><b>Include True Hotfix</b></Checkbox>
                        </Col>
                    </FormGroup>
                </Form>
            </Alert>
        )
    }

    renderChart = () => {
        let rows = this.props.rows;
        let newCount = rows.filter( row => row.hfid && !row.cancelDate && !row.confirmDate && !row.productionDate ).length
        let readyCount = rows.filter( row => row.hfid && !row.cancelDate && row.confirmDate && !row.productionDate ).length
        let manualCount = rows.filter( row => row.hfid && !row.cancelDate && row.manualDate && !row.productionDate ).length

        let mergeCurrentV0Count = rows.filter( row => row.hfid && !row.cancelDate && row.productionDate && !row.hfid2 ).length
        let mergeNextCount = rows.filter( row => row.hfid && !row.cancelDate && row.productionDate && !row.hfid3 ).length
        let mergeNextV0Count = rows.filter( row => row.hfid && !row.cancelDate && row.productionDate && !row.hfid4 ).length

        let allCount = rows.filter( row => row.hfid && !row.cancelDate ).length

        return (
            <SummaryChart
                allCount={allCount}
                newCount={newCount}
                readyCount={readyCount}
                manualCount={manualCount}
                mergeCurrentV0Count={mergeCurrentV0Count}
                mergeNextCount={mergeNextCount}
                mergeNextV0Count={mergeNextV0Count}
                />
        )
    }

    render() {


        return (
            <div>
                <Alert>
                    <HelpBlock>{this.props.helpMessage()}</HelpBlock>
                    <div>
                        <ButtonGroup>
                            <Button className={this.props.relsMode ? "btn-warning" : ""} onClick={this.onRelsClick}>Release To Production</Button>
                            <Button className={this.props.depnMode ? "btn-warning" : ""} onClick={this.onDepnClick}>Resolve Dependency</Button>
                            <Button className={this.props.editMode ? "btn-warning" : ""} onClick={this.onEditClick}>Edit Info</Button>
                        </ButtonGroup>
                    </div>
                    <ButtonGroup>
                        <Button disabled={this.props.relsMode ? false : true} className="btn-info" onClick={this.onRelsSendMail}>Send Mail Confirm VM</Button>
                        <Button disabled={this.props.editMode ? false : true} className="btn-info" onClick={this.props.onAddRow}>Add</Button>
                        <Button disabled={this.props.relsMode ? true : false} className="btn-info" onClick={this.props.onToggleFilter}>Filter</Button>
                        <Button disabled={this.props.editMode ? false : true} className="btn-info" onClick={this.props.onSort}>Sort By Creation Date</Button>
                        <Button disabled={this.props.editMode && !this.state.showSyncSettings ? false : true} className="btn-info" onClick={this.props.onSync}>Sync Hotfix</Button>
                        <Button disabled={this.props.editMode ? false : true} className={this.state.showSyncSettings ? "btn-warning" : "btn-info"} onClick={this.onSyncSettings}>{this.state.showSyncSettings ? "Save Settings" : "Sync Settings"}</Button>
                        <Button disabled={false} className={this.state.showChart ? "btn-warning" : "btn-info"} onClick={this.onChart}>{this.state.showChart ? "Hide Chart" : "Show Chart"}</Button>
                        <Button disabled={false} className="btn-info" onClick={this.onSave}>Save Document</Button>
                    </ButtonGroup>

                </Alert>
                {this.state.showChart ? this.renderChart() : ""}
                {this.state.showSyncSettings ? this.renderSettings() : ""}
            </div>
        )
    }
}