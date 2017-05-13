const { editors: { EditorBase } } = require( 'react-data-grid' );
import ReactDOM from "react-dom"

export class TextAreaEditor extends EditorBase {

    getInputNode() {
        return ReactDOM.findDOMNode( this );
    }

    onClick() {
        this.getInputNode().focus();
    }

    onDoubleClick() {
        this.getInputNode().focus();
    }

    render() {
        return (
            <textarea>{this.props.value}</textarea>
        )
    }

}