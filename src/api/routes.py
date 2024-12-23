"""
This module takes care of starting the API Server, Loading the DB and Adding the endpoints
"""
from flask import Flask, request, jsonify, url_for, Blueprint
from api.models import db, Users
from api.utils import generate_sitemap, APIException
from flask_cors import CORS
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity
import bcrypt

api = Blueprint('api', __name__)

# Allow CORS requests to this API
CORS(api)


@api.route('/singup', methods=['POST'])
def create_user():
    request_body = request.get_json()

    hashed_password = bcrypt.hashpw(request_body["password"].encode('utf-8'), bcrypt.gensalt())

    if request_body is None or request_body["email"] is None or len(request_body["email"]) < 1 or request_body["password"] is None or len(request_body["password"]) < 1:
        return jsonify({"error": "Request body is empty or not valid values"}), 400
    
    user_duplicate = Users.query.filter_by(email=request_body["email"]).first()
    if user_duplicate is not None:
        return jsonify({"error": "User already exists"}), 400
    
    user = Users(name=request_body["name"], email=request_body["email"], password=hashed_password, id_rol=2)
    db.session.add(user)
    db.session.commit()
    return jsonify({"success": "User created successfully"}), 200

@api.route('/login', methods=['POST'])
def login():
    request_body = request.get_json()

    if request_body is None or len(request_body["email"]) < 1 or len(request_body["password"]) < 1:
        return jsonify({"error": "Request body is empty or not valid values"}), 400
    
    user = Users.query.filter_by(email=request_body["email"], password=request_body["password"]).first()
    if user is None:
        return jsonify({"error": "User not found"}), 404
    
    token = create_access_token(identity=user.email)

    return jsonify({"token": token}), 200

@api.route('/profile', methods=['GET'])
@jwt_required()
def profile():
    current_user = get_jwt_identity()
    user = Users.query.filter_by(email=current_user).first()
    return jsonify(user.serialize()), 200