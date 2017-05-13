import React from "react"
import ReactDOM from "react-dom"
import TinyMCE from 'react-tinymce'
import $dateformat from "dateformat"
import { InputGroup, Col, Alert, Modal, Button, FormGroup, ControlLabel, Form, FormControl, HelpBlock, Tabs, Tab, ButtonGroup, Table, Checkbox, Panel } from "react-bootstrap"

class MailClient extends React.Component {
    constructor( props ) {
        super( props )
        this.state = {
            value: pageProperties.mailInfo.mailBody
        }
        this.editor = (
            <TinyMCE
                content={this.state.value}
                config={{
                    plugins: 'link image code table',
                    toolbar: 'undo redo | bold italic | alignleft aligncenter alignright | code | refresh cancel send',
                    height: "500px"
                }}
                onChange={this.setStateOnValueChange}
                />
        )
    }

    render() {
        return (
            <div>
                <Form horizontal>
                    <FormGroup>
                        <Col componentClass={ControlLabel} sm={2}>
                            Subject:
                        </Col>
                        <Col sm={8}>
                            <FormControl type="text" defaultValue={pageProperties.mailInfo.subject} />
                        </Col>
                    </FormGroup>
                    <FormGroup>
                        <Col componentClass={ControlLabel} sm={2}>
                            Mail TO:
                            </Col>
                        <Col sm={8}>
                            <FormControl type="text" defaultValue={pageProperties.mailInfo.mailto ? pageProperties.mailInfo.mailto.join(", ") : null} />
                        </Col>
                    </FormGroup>
                    <FormGroup>
                        <Col componentClass={ControlLabel} sm={2}>
                            Mail CC:
                                </Col>
                        <Col sm={8}>
                                <FormControl type="text" defaultValue={pageProperties.mailInfo.mailcc ? pageProperties.mailInfo.mailcc.join(", ") : null} />
                        </Col>
                    </FormGroup>
                    <FormGroup>
                        <Col componentClass={ControlLabel} sm={2}>
                            Sender Name:
                                    </Col>
                        <Col sm={8}>
                                <FormControl type="text" defaultValue={pageProperties.mailInfo.senderName} />
                        </Col>
                    </FormGroup>
                    <FormGroup>
                        <Col sm={10} className="text-right">
                            <Button>Send Mail</Button>
                        </Col>
                    </FormGroup>
                </Form>
                <Alert>
                    {this.editor}
                </Alert>
            </div>
        )
    }
}

ReactDOM.render(
    <MailClient />,
    document.getElementById( 'react-mail-client' )
)