import React from "react"
import ReactDOM from "react-dom"
import TinyMCE from 'react-tinymce'
import $dateformat from "dateformat"
import { InputGroup, Col, Alert, Modal, Button, FormGroup, ControlLabel, Form, FormControl, HelpBlock, Tabs, Tab, ButtonGroup, Table, Checkbox, Panel } from "react-bootstrap"
import $update from "immutability-helper"
import func$ from "../hotfix/hotfix-tracking-func"
import LoadingOverlay from "react-loading-overlay";

class MailClient extends React.Component {
    constructor( props ) {
        super( props )

        this.state = {
            mailInfo: pageProperties.mailInfo,
            loading: false
        }
        console.log( this.state.mailInfo )
        this.editor = (
            <TinyMCE
                content={this.state.mailInfo.mailBody}
                config={{
                    plugins: 'link image code table',
                    toolbar: 'undo redo | bold italic | alignleft aligncenter alignright | code | refresh cancel send',
                    height: "500px"
                }}
                onChange={this.setStateOnValueChange}
                />
        )
    }

    onAttachementDiscard = ( i ) => {
        let atc = this.state.mailInfo.attachements.slice()
        atc.splice( i, 1 )
        this.setState( {
            mailInfo: $update( this.state.mailInfo, {
                $merge: {
                    attachements: atc
                }
            })
        })
    }

    onAttachementAdded = () => {
        let file = this.fileBrowser.files[0]
        let id = file.name
        this.setState( { loading: true }, () => {
            func$.putResource( { id: id, file: file }).done(() => {
                let atc = this.state.mailInfo.attachements.slice()
                atc = $update( atc, { $unshift: [this.fileBrowser.files[0].name] })
                this.setState( {
                    loading: false,
                    mailInfo: $update( this.state.mailInfo, {
                        $merge: {
                            attachements: atc
                        }
                    })
                })
            }).fail(( err ) => {
                alert( err.responseText )
                this.setState( { loading: false })
            })
        })
    }

    sendMail = () => {
        this.setState( { loading: true }, () => {
            func$.sendMail( this.state.mailInfo ).done(() => {
                alert( "Sent mail successfully." )
                this.setState( { loading: false })
            }).fail(( err ) => {
                alert( "Sending mail has failed: " + err.responseText )
                this.setState( { loading: false })
            })
        })
    }

    onSubjectChanged = () => {
        this.setState( {
            mailInfo: $update( this.state.mailInfo, {
                $merge: {
                    subject: this.inputSubject.value
                }
            })
        })
    }

    onMailToChanged = () => {
        this.setState( {
            mailInfo: $update( this.state.mailInfo, {
                $merge: {
                    mailto: this.inputMailTo.value.split( /, */ )
                }
            })
        })
    }

    onMailCCChanged = () => {
        this.setState( {
            mailInfo: $update( this.state.mailInfo, {
                $merge: {
                    mailcc: this.inputMailCC.value.split( /, */ )
                }
            })
        })
    }

    onSenderNameChanged = () => {
        this.setState( {
            mailInfo: $update( this.state.mailInfo, {
                $merge: {
                    senderName: this.inputSenderName.value
                }
            })
        })
    }

    render() {
        return (
            <div>
                <LoadingOverlay active={this.state.loading} text={"Loading..."} spinner background="rgba(57, 204, 204, 0.5)" >
                    <Form horizontal>
                        <FormGroup>
                            <Col componentClass={ControlLabel} sm={2}>
                                Subject:
                        </Col>
                            <Col sm={8}>
                                <FormControl inputRef={ele => this.inputSubject = ele} onBlur={this.onSubjectChanged} type="text" defaultValue={this.state.mailInfo.subject} />
                            </Col>
                        </FormGroup>
                        <FormGroup>
                            <Col componentClass={ControlLabel} sm={2}>
                                Mail TO:
                            </Col>
                            <Col sm={8}>
                                <FormControl inputRef={ele => this.inputMailTo = ele} onBlur={this.onMailToChanged} type="text" defaultValue={this.state.mailInfo.mailto ? this.state.mailInfo.mailto.join( ", " ) : null} />
                            </Col>
                        </FormGroup>
                        <FormGroup>
                            <Col componentClass={ControlLabel} sm={2}>
                                Mail CC:
                                </Col>
                            <Col sm={8}>
                                <FormControl inputRef={ele => this.inputMailCC = ele} onBlur={this.onMailCCChanged} type="text" defaultValue={this.state.mailInfo.mailcc ? this.state.mailInfo.mailcc.join( ", " ) : null} />
                            </Col>
                        </FormGroup>
                        <FormGroup>
                            <Col componentClass={ControlLabel} sm={2}>
                                Sender Name:
                        </Col>
                            <Col sm={8}>
                                <FormControl inputRef={ele => this.inputSenderName = ele} onBlur={this.onSenderNameChanged} type="text" defaultValue={this.state.mailInfo.senderName} />
                            </Col>
                        </FormGroup>
                        <FormGroup>
                            <Col componentClass={ControlLabel} sm={2}>
                                Attachements:
                        </Col>
                            <Col sm={8} >
                                <input ref={ele => this.fileBrowser = ele} type="file" id="fileBrowser" style={{ display: "none" }} onChange={this.onAttachementAdded} />
                                <input type="button" value="Add Attachement" onClick={() => this.fileBrowser.click()} />
                            </Col>
                        </FormGroup>
                        <FormGroup>
                            {
                                this.state.mailInfo.attachements.map(( fileName, i ) => (
                                    <Col sm={8} smOffset={2}><Alert onDismiss={() => this.onAttachementDiscard( i )}>{fileName}</Alert></Col>
                                ) )
                            }
                        </FormGroup>
                        <FormGroup>
                            <Col sm={10} className="text-right">
                                <Button onClick={this.sendMail}>Send Mail</Button>
                            </Col>
                        </FormGroup>
                    </Form>
                    <Alert>
                        {this.editor}
                    </Alert>
                </LoadingOverlay>
            </div>

        )
    }
}

ReactDOM.render(
    <MailClient />,
    document.getElementById( 'react-mail-client' )
)