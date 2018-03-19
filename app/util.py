from flask import jsonify
DATA_NOT_FOUND_CODE = 404

def get_response(data):
	if data is None:
		return None
	else:
		return data.format()

def error(message):
	resp = jsonify({"Error": message})
	resp.status_code = DATA_NOT_FOUND_CODE
	return resp

def get_all_items(model, orderid, modelname):
	data = model.query.order_by(orderid).limit(400).all()
	if not data:
		return error("Data not found for " + modelname + "model")
	return jsonify([get_response(rep) for rep in data])



def get_single_item(model, model_id, parameter):
	data = model.query.filter(model_id == parameter).first()
	if not data:
		return error("Item not found for id " + parameter)
	return jsonify(get_response(data))
