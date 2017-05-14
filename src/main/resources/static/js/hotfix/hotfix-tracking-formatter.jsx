import $moment from "moment"
import { SingleDatePicker } from 'react-dates'
import { Tooltip, OverlayTrigger, DropdownButton, Modal, Button, FormGroup, ControlLabel, Form, FormControl, HelpBlock, Tabs, Tab, ButtonGroup, Table, Checkbox } from "react-bootstrap"
import $dateformat from "dateformat"
import $ from "jquery"
import React from "react"
import ReactDOM from 'react-dom';
import $update from "immutability-helper"

export class TextFormatter extends React.Component {

    state = {
        showTooltip: false
    }

    addTooltip = () => {
        this.setState( { showTooltip: true })
    }

    removeTooltip = () => {
        this.setState( { showTooltip: false })
    }

    render() {
        if ( this.props.value ) {

            if ( this.state.showTooltip ) {
                return (
                    <div>
                        <OverlayTrigger onExited={this.removeTooltip} placement="top" overlay={
                            <Tooltip placement="top" className="in" id="tooltip-top">
                                {this.props.value.split( "," ).filter( text => text ).map( text => <div>{text}</div> )}
                            </Tooltip>
                        }>
                            <div> {this.props.value}</div >
                        </OverlayTrigger>
                    </div>
                )
            } else {
                return <div onMouseOver={this.addTooltip}> {this.props.value}</div >
            }

        } else {
            return <div></div>
        }
    }
}

export class DateFormatter extends React.Component {

    static defaultProps = {
        value: null, // date milliseconds | null
        onValueChange: ( value ) => console.log( value ),
        isEnabled: () => true
    }

    constructor( props ) {
        super( props )
        this.state = { showPicker: false, dateMillis: props.value, gridCell: null }
    }

    onClick = ( ev ) => {
        if ( !this.state.gridCell ) {
            this.setState( { showPicker: true, gridCell: $( ev.target ).closest( ".react-grid-Cell__value" ) })
        } else {
            this.setState( { showPicker: true })
        }

    }

    onFocusChange = ( {focused}) => {
        if ( !focused ) {
            this.closePicker()
        }
    }

    closePicker = () => {
        this.setState( { showPicker: false }, () => {
            this.props.onValueChange( this.props.dependentValues.hfid, this.state.dateMillis )
        })
    }

    onDateChange = ( moment ) => {
        this.setState( { dateMillis: moment ? moment.valueOf() : null })
    }

    componentWillReceiveProps = ( props ) => {
        this.setState( { dateMillis: props.value })
    }

    render = () => {
        if ( !this.props.isEnabled( this.props.dependentValues ) ) {
            return <span className="glyphicon glyphicon-ban-circle" style={{ opacity: 0.5 }} />
        }
        if ( this.state.showPicker ) {
            if ( this.state.gridCell ) {
                $( this.state.gridCell ).css( { overflow: "visible", "z-index": 1 })
            }
            return (
                <div style={{ zIndex: 99, position: "fixed" }}  >
                    <SingleDatePicker
                        date={this.state.dateMillis ? $moment( this.state.dateMillis ) : null} // momentPropTypes.momentObj or null
                        onDateChange={this.onDateChange} // PropTypes.func.isRequired
                        focused={true} // PropTypes.bool
                        onFocusChange={this.onFocusChange} //PropTypes.func.isRequired
                        keepOpenOnDateSelect={false}
                        isOutsideRange={() => false}
                        showClearDate={true}
                        displayFormat={() => "DD MMM YYYY"} />
                </div>
            )
        } else {
            if ( this.state.gridCell ) {
                $( this.state.gridCell ).css( { overflow: "hidden", "z-index": 0 })
            }

            if ( !this.state.dateMillis ) {
                return <div className="btn" onClick={this.onClick}  >
                    <span className="glyphicon glyphicon-calendar" style={{ opacity: 0.5 }} />
                </div>
            } else {
                return <div className="btn" onClick={this.onClick}>{$dateformat( new Date( this.state.dateMillis ), "dd mmm yyyy" )}</div>
            }
        }
    }
}

export class ConfirmHotfixFormatter extends React.Component {

    static defaultProps = {
        dateMillis: null,
        showForm: false,
        onShowForm: () => console.log( "showForm" ),
        onCancelForm: () => console.log( "cancelForm" ),
        onSubmitForm: () => console.log( "submitForm" ),
        isEnabled: () => true
    }

    constructor( props ) {
        super( props )
        this.state = { showForm: false, dateMillis: props.value }
    }

    showForm = ( ev ) => {
        this.setState( {
            showForm: true,
        }, () => {
            this.props.onShowForm( this.props.dependentValues.hfid )
        })
    }

    cancelForm = () => {
        let sanityDesc = this.sanityDescInput.value
        let rollbackDesc = this.rollbackDescInput.value
        let deploymentRemark = this.deploymentRemark.value
        let isRestartRequired = this.isRestartRequiredCheckBox.checked
        let testResult = this.testResultInput.value

        this.setState( { showForm: false }, () => {
            this.props.onCancelForm(
                this.props.dependentValues.hfid,
                sanityDesc,
                rollbackDesc,
                deploymentRemark,
                isRestartRequired,
                testResult
            )
        })
    }

    submitForm = () => {
        let sanityDesc = this.sanityDescInput.value
        let rollbackDesc = this.rollbackDescInput.value
        let deploymentRemark = this.deploymentRemark.value
        let isRestartRequired = this.isRestartRequiredCheckBox.checked

        let file = this.testResultInput.files[0]
        let testResult = !file ? null : {
            id: file.name,
            file: file
        }

        console.log( this.testResultInput.files )

        this.setState( { showForm: false }, () => {
            this.props.onSubmitForm(
                this.props.dependentValues.hfid,
                sanityDesc,
                rollbackDesc,
                deploymentRemark,
                isRestartRequired,
                testResult
            )
        })
    }

    refresh = () => {
        this.setState({})
    }

    render() {
        if ( !this.props.isEnabled( this.props.dependentValues ) ) {
            return <span className="glyphicon glyphicon-ban-circle" style={{ opacity: 0.5 }} />
        }
        
        let _testResult = this.testResultInput ? 
                this.testResultInput.value : (this.props.dependentValues.testResult ? 
                        this.props.dependentValues.testResult : null)
        
        if ( this.state.showForm ) {
            return (
                <div style={{ zIndex: 99, position: "fixed" }}  >
                    <Button />
                    <form>
                        <Modal show={true} onHide={this.cancelForm}>
                            <Modal.Header closeButton>
                                <Modal.Title>Confirm Hotfix</Modal.Title>
                            </Modal.Header>
                            <Modal.Body>
                                <FormGroup controlId="sanity-details" validationState="success">
                                    <ControlLabel>How do you sanity test this hotfix, or when to know that it works on production?</ControlLabel>
                                    <FormControl inputRef={ele => this.sanityDescInput = ele} componentClass="textarea" >{this.props.dependentValues.sanityDesc}</FormControl>
                                </FormGroup>
                                <FormGroup controlId="rollback-details" validationState="success">
                                    <ControlLabel>What is the situation that this hotfix need a rollback, and how to?</ControlLabel>
                                    <FormControl inputRef={ele => this.rollbackDescInput = ele} componentClass="textarea" >{this.props.dependentValues.rollbackDesc}</FormControl>
                                </FormGroup>
                                <FormGroup controlId="deployment-details" validationState="success">
                                    <ControlLabel>Does this hotfix have special deployment remark?</ControlLabel>
                                    <FormControl inputRef={ele => this.deploymentRemark = ele} componentClass="textarea" >{this.props.dependentValues.deploymentRemark}</FormControl>
                                </FormGroup>
                                <Checkbox inputRef={ele => this.isRestartRequiredCheckBox = ele} defaultChecked={this.props.dependentValues.isRestartRequired} >
                                    Require restart
                                </Checkbox>
                                <FormGroup controlId="test-result" validationState="success">
                                    <ControlLabel>Please attach the test result or review document.</ControlLabel>
                                    {
                                        _testResult ? <div><span className="glyphicon glyphicon-open-file" />{" " + _testResult}</div> : ""
                                    }
                                    <FormControl onChange={this.refresh} inputRef={ele => this.testResultInput = ele} type="file" />
                                </FormGroup>
                            </Modal.Body>
                            <Modal.Footer>
                                <FormGroup>
                                    <Button onClick={this.cancelForm}>Cancel</Button>
                                    <Button onClick={this.submitForm} className="btn btn-primary" type="submit">Submit</Button>
                                </FormGroup>
                            </Modal.Footer>
                        </Modal>

                    </form>
                </div>
            )
        } else {
            if ( !this.props.value ) {
                return <div className="btn" onClick={this.showForm} >
                    <span className="glyphicon glyphicon-plus" style={{ opacity: 0.5 }} />
                </div>
            } else {
                return <div className="btn" onClick={this.showForm}>{$dateformat( new Date( this.props.value ), "dd mmm yyyy" )}</div>
            }

        }
    }
}

export class ControlFormatter extends React.Component {

    static defaultProps = {
        onDel: ( row ) => console.log( row ),
    }

    constructor( props ) {
        super( props )
    }

    onDel = ( ev ) => {
        this.props.onDel( this.props.dependentValues )
    }

    render() {
        return (
            <div>
                <ButtonGroup>
                    <Button className="hfx-control hfx-control-del glyphicon glyphicon-trash" onClick={this.onDel} />
                </ButtonGroup>
            </div>
        )
    }
}



export class DepnControlFormatter extends React.Component {

    static defaultProps = {
        setDependencyType: ( hfid, depnType ) => console.log( rowIdx, depnType ),
        getDepdendencyType: ( hfid ) => "NODEPEND"
    }

    constructor( props ) {
        super( props )
    }

    updateDepnTogether = () => {
        this.props.setDependencyType( this.props.dependentValues.hfid, "TOGETHER" )
    }
    updateDepReplaced = () => {
        this.props.setDependencyType( this.props.dependentValues.hfid, "REPLACED" )
    }
    updateDepnUnresolved = () => {
        this.props.setDependencyType( this.props.dependentValues.hfid, "UNRESOLVED" )
    }
    updateDepnNoDepend = () => {
        this.props.setDependencyType( this.props.dependentValues.hfid, "NODEPEND" )
    }

    renderBtnTogether = () => {
        let style = ( this.getDependencyType() === "TOGETHER" ) ? "btn-success" : "btn-default"
        return <Button className={"hfx-resolve hfx-resolve-together " + style} onClick={this.updateDepnTogether} >
            <span className="glyphicon glyphicon-plus-sign" />
        </Button>
    }

    renderBtnReplaced = () => {
        let style = ( this.getDependencyType() === "REPLACED" ) ? "btn-success" : "btn-default"
        return <Button className={"hfx-resolve hfx-resolve-replaced " + style} onClick={this.updateDepReplaced} >
            <span className="glyphicon glyphicon-ok-sign" />
        </Button>
    }

    renderBtnUnresolved = () => {
        let style = ( this.getDependencyType() === "UNRESOLVED" ) ? "btn-danger" : "btn-default"
        return <Button className={"hfx-resolve hfx-resolve-unresolved " + style} onClick={this.updateDepnUnresolved} >
            <span className="glyphicon glyphicon-warning-sign" />
        </Button>
    }

    renderBtnNoDepend = () => {
        let style = ( this.getDependencyType() === "NODEPEND" ) ? "btn-default" : "btn-default"
        return <Button className={"hfx-resolve hfx-resolve-nodepend " + style} onClick={this.updateDepnNoDepend} >
            <span className="glyphicon glyphicon-remove-sign" />
        </Button>
    }

    getDependencyType = () => {
        return this.props.getDependencyType( this.props.dependentValues.hfid )
    }

    render() {
        if ( this.getDependencyType() === "SELF" || this.props.dependentValues.productionDate ) {
            return <div></div>
        }

        return (
            <div>
                <ButtonGroup>
                    {this.renderBtnTogether()}
                    {this.renderBtnReplaced()}
                    {this.renderBtnUnresolved()}
                    {this.renderBtnNoDepend()}
                </ButtonGroup>
            </div>
        )
    }
}

export class DepnSelectionFormatter extends React.Component {
    static defaultProps = {
        setSelectedHFID: ( rowIdx ) => console.log( rowIdx ),
        getSelectedHFID: () => null
    }

    onSelect = () => {
        this.props.setSelectedHFID( this.props.dependentValues.hfid )
    }

    render() {
        if ( this.props.getSelectedHFID() === this.props.dependentValues.hfid ) {
            return <div className="btn" onClick={this.onSelect} style={{ width: "100%", height: "100%", opacity: 1.0 }} ><span className="glyphicon glyphicon-asterisk" /></div>
        } else {
            return <div className="btn" onClick={this.onSelect} style={{ width: "100%", height: "100%", opacity: 0.3 }} ><span className="glyphicon glyphicon-asterisk" /></div>
        }

    }
}

export class RelsSelectionFormatter extends React.Component {
    static defaultProps = {
        addSelectedHFID: ( HFID ) => console.log( HFID ),
        getSelectedHFIDList: () => []
    }

    onSelect = () => {
        this.props.addSelectedHFID( this.props.dependentValues.hfid )
    }

    render() {
        if ( this.props.getSelectedHFIDList().includes( this.props.dependentValues.hfid ) ) {
            return <div className="btn" onClick={this.onSelect} style={{ width: "100%", height: "100%" }} ><span className="glyphicon glyphicon-check" /></div>
        } else {
            return <div className="btn" onClick={this.onSelect} style={{ width: "100%", height: "100%" }} ><span className="glyphicon glyphicon-unchecked" /></div>
        }

    }
}

export class HFIDFormatter extends React.Component {

    state = {
        showTooltip: false
    }

    onMail = () => {
        this.props.onMail( this.props.value, this.props.column, this.props.dependentValues )
    }

    onSync = () => {
        this.props.onSync( this.props.value )
    }

    onSee = () => {
        this.props.onSee( this.props.value, this.props.dependentValues )
    }

    onTooltipExit = ( ev, x ) => {
        console.log( x )
    }

    addTooltip = () => {
        this.setState( { showTooltip: true })
    }

    removeTooltip = () => {
        this.setState( { showTooltip: false })
    }

    render() {
        if ( this.props.value ) {
            if ( this.state.showTooltip ) {
                return (
                    <OverlayTrigger onExited={this.removeTooltip} delayHide="1000" placement="top" overlay={
                        <Tooltip placement="top" className="in" id="tooltip-top">
                            <ButtonGroup onMouseOver={this.onMouseOverTooltip}>
                                <Button className="hfx-control hfx-control-mail glyphicon glyphicon-envelope" onClick={this.onMail} />
                                <Button className="hfx-control hfx-control-del glyphicon glyphicon-refresh" onClick={this.onSync} />
                                <Button className="hfx-control hfx-control-see glyphicon glyphicon-eye-open" onClick={this.onSee} />
                            </ButtonGroup>
                        </Tooltip>
                    }>
                        <div>{this.props.value}</div>
                    </OverlayTrigger>
                )
            } else {
                return <div onMouseOver={this.addTooltip}>{this.props.value}</div>
            }

        } else {
            return <span />
        }
    }
}

export class CancelFormatter extends React.Component {

    onCancel = () => {
        this.props.onValueChange( this.props.dependentValues.hfid, new Date().getTime() )
    }

    onActivate = () => {
        this.props.onValueChange( this.props.dependentValues.hfid, null )
    }

    render() {
        if ( this.props.value ) {
            return <div className="btn" onClick={this.onActivate}>{$dateformat( new Date( this.props.value ), "dd mmm yyyy" )}</div>
        } else {
            return <div className="btn" onClick={this.onCancel}  >
                <span className="glyphicon glyphicon-ban-circle" style={{ opacity: 0.5 }} />
            </div>
        }
    }
}

