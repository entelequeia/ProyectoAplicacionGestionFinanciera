from flask import Blueprint, request, jsonify
from api.models import db, Finances, Categories, Types
from  flask_cors import CORS

finances_bp = Blueprint('finances', __name__)
CORS(finances_bp)
# Ruta para obtener las categorías
@finances_bp.route('/api/get_categories', methods=['GET'])
def get_categories():
    category = Categories.query.all()
    return jsonify([category.serialize() for category in category])

# Ruta para obtener los tipos
@finances_bp.route('/api/get_types', methods=['GET'])
def get_types():
    types = Types.query.all()
    return jsonify([type.serialize() for type in types])

@finances_bp.route('/api/finances', methods= ['GET'])
def get_finances():
    finances = Finances.query.all()
    return jsonify([finance.serialize() for finance in finances]), 200

@finances_bp.route('/api/finances/<int:id>', methods= ['GET'])
def get_finances_id(id):
    finance = Finances.query.filter_by(id_finance=id).first()
    if not finance:
        return jsonify({"error": "Finance not found"}), 404
    return jsonify(finance.serialize()), 200

@finances_bp.route('/api/create_finance', methods=['POST'])
def create_finance():
    data = request.get_json()
    try:
        new_finance = Finances(
            name=data['name'],
            amount=data['amount'],
            date=data['date'],
            description=data.get('description'),
            id_category=data['id_category'],
            id_user=data['id_user'],
            id_type=data['id_type']
        )
        db.session.add(new_finance)
        db.session.commit()
        return jsonify(new_finance.serialize()), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 400

@finances_bp.route('/api/finances/<int:id>', methods= ['PUT'])
def update_finance(id):
    data = request.get_json()
    finance = Finances.query.get(id)
    if not finance:
        return jsonify({"error": "Finance not found"}), 404
    try:
        finance.name = data['name']  
        finance.amount = data['amount']  
        finance.date = data['date']  
        finance.description = data.get('description')  
        finance.id_category = data['id_category']  
        finance.id_user = data['id_user']  
        finance.id_type = data['id_type']  
        db.session.commit()  
        return jsonify(finance.serialize()), 200  
    except Exception as e:  
        return jsonify({"error": str(e)}), 400
    
@finances_bp.route('/api/finances/<int:id>', methods= ['DELETE'])
def delete_finance(id):
    finance = Finances.query.get(id)
    if not finance:
        return jsonify ({"error" : "Finance not found"}), 404
    db.session.delete(finance)
    db.session.commit()
    return jsonify ({"message" : "Finance deleted successflly"}), 200
