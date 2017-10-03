/*  Normalise the CWL format to make it convenient to process.

    The CWL format has many optional aspects to the syntax, which is convenient
    for humans, but less-convenient for programming.

    This moodule normalises the format of a CWL module, to convert into a
    canonical form, which is easier to process.
*/

"use strict";


/*
    Normalise WorkflowStepInput

    convert the source field into an array of strings
*/

function normalise_workflow_step_input(input) {
    if (input.hasOwnProperty("source")) {
        const source = input.source;
        if(typeof source === "string") {
            // We make all sources an array, for consistency
            input.source = [source];
        }
    }
    else {
        input.source = [];
    }
    return input;
}


/*  Currently the identity function, but we leave the placeholder here
    in case we want to perform more normalisation in the future
*/

function normalise_input_parameter(input_parameter) {
    return input_parameter;
}

/*  Return true if an object is an InputParameter, and false otherwise.

    CWL doesn't tag the type of entries in the workflow, which is pretty
    annoying from a programming point of view. So to check if something is an
    InputParameter, the best we can do is check if it has any of the possible
    properties.

    This is needed, for example, when normalising the inputs to a workflow,
    because the syntax allows:

        array<InputParameter> |
        map<InputParameter.id, InputParameter.type> |
        map<InputParameter.id, InputParameter>

    If we want to tell the second and third options apart we need to tell the
    difference between InputParameter.type and InputParameter

    Unfortunately, both InputParameter.type and InputParameter can be arbitrary
    objects (more or less), so the best we can hope is that the don't have
    overlapping properties.
*/

function is_input_parameter(object) {
    // The properties allowed for an InputParameter
    const properties = ["id", "label", "secondaryFiles", "format", "streamable", "doc", "inputBinding", "default", "type"];
    for (var i = 0; i < properties.length; i++) {
        if (object.hasOwnProperty(properties[i])) {
            return true;
        }
    }
    return false;
}

/*
    Normalise Workflow inputs

    Can be:
        array<InputParameter> |
        map<InputParameter.id, InputParameter.type> |
        map<InputParameter.id, InputParameter>

    We convert them all to:

        array<normalised(InputParameter)>

    Algorithm:
        1. Check if the workflow has an "inputs" property.
        2. Convert the map formats into array<InputParameter>
        3. Normalise each element in the result of step 2.

    Notes:
        If there is no "inputs" property then we set the result
        to be an empty array.
*/

function normalise_inputs(workflow) {
    var result = [];
    if (workflow.hasOwnProperty("inputs")) {
        var input_parameters = [];
        // Check if the inputs are an array or a map.
        // If not an array then we assume they must be a map.
        const inputs = workflow.inputs;
        if (! Array.isArray(inputs)) {
            // Iterate over each item in the map
            for (var property in inputs) {
                if (inputs.hasOwnProperty(property)) {
                    const value = inputs[property];
                    // We have the syntax:
                    // property: value
                    if (is_input_parameter(value)) {
                        // The rhs of the map was itself an InputParameter
                        // set its id to the rhs of the map
                        value.id = property;
                        input_parameters.push(value);
                    }
                    else {
                        // the rhs must have been an InputParameter.type
                        input_parameters.push({ id: property, type: value });
                    }
                }
            }
        }
        else {
            // The "inputs" property was an array
            input_parameters = workflow.inputs;
        }
        for (var i = 0; i < input_parameters.length; i++) {
            result.push(normalise_input_parameter(input_parameters[i]));
        }
    }
    return result;
}

/*  
 * Convert the outputSource field into an array, if it is not already an array.
*/

function normalise_workflow_output_parameter(output_parameter) {
    if (! Array.isArray(output_parameter.outputSource)) {
        output_parameter.outputSource = [output_parameter.outputSource];
    }
    return output_parameter;
}

/*  Return true if an object is an WorkflowOutputParameter, and false otherwise.

    CWL doesn't tag the type of entries in the workflow, which is pretty
    annoying from a programming point of view. So to check if something is an
    OutputParameter, the best we can do is check if it has any of the possible
    properties.

    This is needed, for example, when normalising the outputs to a workflow,
    because the syntax allows:

    array<WorkflowOutputParameter> |
    map<WorkflowOutputParameter.id, WorkflowOutputParameter.type> |
    map<WorkflowOutputParameter.id, WorkflowOutputParameter>

    If we want to tell the second and third options apart we need to tell the
    difference between WorkflowOutputParameter.type and WorkflowOutputParameter

    Unfortunately, both WorkflowOutputParameter.type and WorkflowOutputParameter
    can be arbitrary objects (more or less), so the best we can hope is that
    the don't have overlapping properties.
*/

function is_workflow_output_parameter(object) {
    // The properties allowed for an  WorkflowOutputParameter
    const properties = ["id", "label", "secondaryFiles", "format", "streamable", "doc", "outputBinding", "outputSource", "linkMerge", "type"];
    for (var i = 0; i < properties.length; i++) {
        if (object.hasOwnProperty(properties[i])) {
            return true;
        }
    }
    return false;
}

/*
    Normalise Workflow outputs

    Can be:
        array<WorkflowOutputParameter> |
        map<WorkflowOutputParameter.id, WorkflowOutputParameter.type> |
        map<WorkflowOutputParameter.id, WorkflowOutputParameter>

    We convert them all to:

        array<normalised(WorkflowOuputParameter)>

    Algorithm:
        1. Check if the workflow has an "outputs" property.
        2. Convert the map formats into array<WorkflowOutputParameter>
        3. Normalise each element in the result of step 2.

    Notes:
        If there is no "outputs" property then we set the result
        to be an empty array.
*/

function normalise_outputs(workflow) {
    var result = [];
    if (workflow.hasOwnProperty("outputs")) {
        var output_parameters = [];
        // Check if the outputs are an array or a map.
        // If not an array then we assume they must be a map.
        const outputs = workflow.outputs;
        if (! Array.isArray(outputs)) {
            // Iterate over each item in the map
            for (var property in outputs) {
                if (outputs.hasOwnProperty(property)) {
                    const value = outputs[property];
                    // We have the syntax:
                    // property: value
                    // XXX should really check that it is also NOT a
                    // WorkflowOutputParameter.type
                    if (is_workflow_output_parameter(value)) {
                        // The rhs of the map was itself an OutputParameter
                        // set its id to the rhs of the map
                        value.id = property;
                        output_parameters.push(value);
                    }
                    else {
                        // the rhs must have been an OutputParameter.type
                        output_parameters.push({ id: property, type: value });
                    }
                }
            }
        }
        else {
            // The "outputs" property was an array
            output_parameters = workflow.outputs;
        }
        for (var i = 0; i < output_parameters.length; i++) {
            result.push(normalise_workflow_output_parameter(output_parameters[i]));
        }
    }
    return result;
}

/*  Return true if an object is an WorkflowStepInput, and false otherwise.

    CWL doesn't tag the type of entries in the workflow, which is pretty
    annoying from a programming point of view. So to check if something is an
    WorkflowStepInput, the best we can do is check if it has any of the possible
    properties.
*/

function is_workflow_step_input(object) {
    // The properties allowed for an WorkflowStepInput
    const properties = ["id", "source", "linkMerge", "default", "valueFrom"];
    for (var i = 0; i < properties.length; i++) {
        if (object.hasOwnProperty(properties[i])) {
            return true;
        }
    }
    return false;
}

/*
    Normalise WorkflowStepInputs

    Can be:

        array<WorkflowStepInput> |
        map<WorkflowStepInput.id, WorkflowStepInput.source> |
        map<WorkflowStepInput.id, WorkflowStepInput>

    We convert them all to:

        array<normalised(WorkflowStepInput)>

    Notes:
        If there is no "in" property then we set the result
        to be an empty array.
*/

function normalise_workflow_step_inputs(step) {
    var result = [];
    if (step.hasOwnProperty("in")) {
        var new_step_inputs = [];
        // Check if the inputs are an array or a map.
        // If not an array then we assume they must be a map.
        const step_inputs = step.in;
        if (! Array.isArray(step_inputs)) {
            // Iterate over each item in the map
            for (var property in step_inputs) {
                if (step_inputs.hasOwnProperty(property)) {
                    const value = step_inputs[property];
                    // We have the syntax:
                    // property: value
                    // value could be a WorkflowStepInput.source or
                    // a WorkflowStepInput
                    if (is_workflow_step_input(value)) {
                        value.id = property;
                        new_step_inputs.push(value);
                    }
                    else {
                        // Must be WorkflowStepInput.source
                        new_step_inputs.push({ id: property, source: value})
                    }
                }
            }
        }
        else {
            // The "steps" property was an array
            new_step_inputs = step.in;
        }

        for (var i = 0; i < new_step_inputs.length; i++) {
            result.push(normalise_workflow_step_input(new_step_inputs[i]));
        }
    }
    return result;
}

/*
    Normalise WorkflowStep

*/

function normalise_workflow_step(step) {
    step.in = normalise_workflow_step_inputs(step);
    return step;
}

/*
    Normalise Workflow steps

    XXX Note the official CWL docs do not seem to support the map notation for
    steps, but plenty of examples online seem to follow this style.

    Can be:
        array<WorkflowStep> |
        map<WorkflowStep.id, WorkflowStep>

    We convert them all to:

        array<normalised(WorkflowStep)>

    Notes:
        If there is no "steps" property then we set the result
        to be an empty array.
*/

function normalise_steps(workflow) {
    var result = [];
    if (workflow.hasOwnProperty("steps")) {
        var new_steps = [];
        // Check if the outputs are an array or a map.
        // If not an array then we assume they must be a map.
        const steps = workflow.steps;
        if (! Array.isArray(steps)) {
            // Iterate over each item in the map
            for (var property in steps) {
                if (steps.hasOwnProperty(property)) {
                    const value = steps[property];
                    // We have the syntax:
                    // property: value
                    // the rhs must have been an OutputParameter.type
                    value.id = property;
                    new_steps.push(value);
                }
            }
        }
        else {
            // The "steps" property was an array
            new_steps = workflow.steps;
        }

        for (var i = 0; i < new_steps.length; i++) {
            result.push(normalise_workflow_step(new_steps[i]));
        }
    }
    return result;
}

function normalise_workflow(workflow) {
    workflow.inputs = normalise_inputs(workflow);
    workflow.outputs = normalise_outputs(workflow);
    workflow.steps = normalise_steps(workflow);
    return workflow;
}
