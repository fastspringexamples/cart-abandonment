/*
 * Functions that interact with the JSON Editor component
 */


/*  customizeJSONEditor
 *
 *  The default version of the editor comes with some extra buttons that aren't really
 *  needed in this application. This functions deletes them and changes the styles a bit
 *  to accommodate for a custom title
 */ 
function customizeJSONEditor() {
    // Remove unneeded buttons
    $('.jsoneditor-repair').remove();
    $('.jsoneditor-transform').remove();
    $('.jsoneditor-sort').remove();

    // Swap children and push them to the right
    const editorElement = $('.jsoneditor-menu');
    const children = editorElement.children();
    children.sort((() => -1 ));
    $('.jsoneditor-menu').empty();
    children.appendTo(editorElement);
    // Insert title
    const editorTitle = '<p class="editor-title"> Custom JSON Payload </p>';
    editorElement.prepend(editorTitle);
}

/*  checkPayloadValidity
 *
 *  This function is hooked up to the 'onChange' callback of the JSONEditor component.
 *  Check common.js to see its initialization
 */ 
function checkPayloadValidity() {
    let isValid = true;
    try {
        JsonEditor.get();
    } catch (e) {
        isValid = false;
    }
    return isValid;
}

/*  renderJSONEditor
 *
 *  Util to render the new content in the editor
 */ 
function renderJSONEditor(payload) {
    JsonEditor.set(payload);
}
