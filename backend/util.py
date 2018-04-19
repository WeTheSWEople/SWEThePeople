from flask import jsonify
DATA_NOT_FOUND_CODE = 404


def get_response(data):
    """
    Gets the formatted response for the given item

    data -- the item

    Returns data.format() or None if data is None
    """

    if data is None:
        return None
    return data.format()


def error(message):
    """
    Builds an error response with the given message

    message -- the message to include

    Returns the error JSON
    """

    resp = jsonify({"Error": message})
    resp.status_code = DATA_NOT_FOUND_CODE
    return resp


def get_all_items(model, orderid, modelname):
    """
    Gets all the items from the given model.

    model       -- the model to get items from
    orderid     -- how to order the results
    modelname   -- the name of the model

    Returns the jsonified response from each instance or an error if no model
    found.
    """

    data = model.query.order_by(orderid).limit(500).all()
    if not data:
        return error("Item not found for " + modelname + "model")
    return jsonify([get_response(rep) for rep in data])


def get_single_item(model, model_id, parameter):
    """
    Gets a single item from the given model matching the parameter.

    model       -- the model to get from
    model_id    -- the column to match against
    parameter   -- the value to match

    Returns the jsonified response for a single item or an error if no instance
    found.
    """

    data = model.query.filter(model_id == parameter).first()
    if not data:
        return error("Item not found for id " + parameter)
    return jsonify(get_response(data))
