from flask import Blueprint, request, jsonify
from models import db, Finances

finances_bp = Blueprint ('finances', __name__)

@finances_bp.route('/finances', methods= ['GET'])
def get_finances():
    finances = Finances.query.all()
    return jsonify([finance.serialize() for finance in finances]), 200

@finances_bp.route('/finances/<int:id>', methods= ['GET'])
def get_finance(id):
    finance = Finances.query.get(id)
    if not finance:
        return jsonify({"error": "Finance not found"}), 404
    return jsonify(finance.seriaize()), 200

@finances_bp.route('/finances', methods= ['POST'])
def create_finances():
    data = request.get_json()
    try: 
        new_finance = Finances (
            name=data['name'],
            amount=data['amount'],
            date=data['date'],
            description=data.get['description'],
            id_category=data['id_category'],
            id_user=data['id_user'],
            id_type=data['id_type']
        )
        db.session.add(new_finance)
        db.session.commit()
        return jsonify(new_finance.serialize()), 201
    except Exception as e:
        return jsonify({'error': str(e)}), 400

@finances_bp.route('/finances <int:id>', methods= ['PUT'])
def update_finance():
    data = request.get_json()
    finance = Finances.quary.get(id)
    if not finance:
        return jsonify({"error": "Finance not found"}), 404
    try: 
            finance.name = data ['name']
            finance.amount = data ['amount']
            finance.date = data ['date']
            finance.description = data.get ['description']
            finance.id_category = data ['id_category']
            finance.id_user = data ['id_ser']
            finance.id_type = data ['id_type']
            db.session.commit()
            return jsonify(finance.serialize()), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 400
    
@finances_bp.route('/finances <int:id>', methods= ['DELETE'])
def delete_finance(id):
    finance = Finances.query.get(id)
    if not finance:
        return jsonify ({"error" : "Finance not found"}), 404
    db.session.delete(finance)
    db.session.commit()
    return jsonify ({"message" : "Finance deleted successflly"}), 200
