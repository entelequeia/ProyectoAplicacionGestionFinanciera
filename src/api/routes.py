"""
This module takes care of starting the API Server, Loading the DB and Adding the endpoints
"""
from flask import Flask, request, jsonify, url_for, Blueprint
from api.models import db, Users, Groups, Roles
from api.utils import generate_sitemap, APIException
from flask_cors import CORS
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity
import bcrypt
from flask_mail import Message
from dotenv import load_dotenv
import os
from urllib.parse import quote

load_dotenv()

FRONTEND_URL = os.getenv("FRONTEND_URL", "http://localhost:3000/")

api = Blueprint('api', __name__)

mail = None

def init_mail(app_mail):
    global mail
    mail = app_mail

# Allow CORS requests to this API
CORS(api)

# Crear un nuevo usuario
@api.route('/signup', methods=['POST'])
def create_user():
    try:
        request_body = request.get_json()

        if request_body is None or "email" not in request_body or "password" not in request_body or "name" not in request_body:
            return jsonify({"error": "Request body is empty or not valid values"}), 400
        
        if len(request_body["email"]) < 1 or len(request_body["password"]) < 8 or len(request_body["name"]) < 1:
            return jsonify({"error": "Invalid request: Email or password is too short"}), 400
        
        user_duplicate = Users.query.filter_by(email=request_body["email"]).first()
        if user_duplicate:
            return jsonify({"error": "User already exists"}), 400
        
        hashed_password = bcrypt.hashpw(request_body["password"].encode('utf-8'), bcrypt.gensalt()).decode('utf-8')

        user = Users(name=request_body["name"], email=request_body["email"], password=hashed_password, id_rol=2)
        db.session.add(user)
        db.session.commit()
        return jsonify({"success": "User created successfully"}), 200
    
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# Iniciar sesión con usuario existente y obtener token
@api.route('/login', methods=['POST'])
def login():
    try:
        request_body = request.get_json()

        if not request_body or "email" not in request_body or "password" not in request_body:
            return jsonify({"error": "Invalid request: Missing email or password"}), 400
        
        if len(request_body["email"]) < 1 or len(request_body["password"]) < 1:
            return jsonify({"error": "Invalid request: Email or password is too short"}), 400
        
        user = Users.query.filter_by(email=request_body["email"]).first()
        if not user:
            return jsonify({"error": "User not found"}), 404

        if not bcrypt.checkpw(request_body["password"].encode('utf-8'), user.password.encode('utf-8')):
            return jsonify({"error": "Invalid password"}), 401
        
        token = create_access_token(identity=user.email)
        return jsonify({"token": token}), 200
    
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# Solo se puede acceder a esta ruta si el token es válido
@api.route('/home', methods=['GET'])
@jwt_required()
def profile():
    try:
        current_user = get_jwt_identity()
        user = Users.query.filter_by(email=current_user).first()
        return jsonify(user.serialize()), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# Obtener las finanzas de un usuario
@api.route('/get_finances/<int:id_user>', methods=['GET'])
def finances(id_user):
    try:
        user = Users.query.filter_by(id_user=id_user).first()

        if not user:
            return jsonify({"error": "User not found"}), 404

        response = [finance.serialize() for finance in user.finances]
        return jsonify(response), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    
# Obtener Finanzas con Categoría y Tipo
@api.route('/get_finances_all/<int:id_user>', methods=['GET'])
def get_finanzes_all(id_user):
    try:
        user = Users.query.filter_by(id_user=id_user).first()

        if not user:
            return jsonify({"error": "User not found"}), 404

        # Iteramos las finanzas del usuario
        response = []
        for finance in user.finances:
            finance_data = finance.serialize()

            # Accedemos al nombre de la categoría y lo añadimos
            finance_data["category"] = finance.category.category  # finance.category es el objeto relacionado
            
            # Accedemos al nombre del tipo y lo añadimos
            finance_data["type"] = finance.types.type if finance.types else None  # finance.types es el objeto relacionado
            
            response.append(finance_data)

        return jsonify(response), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# Crear un nuevo grupo    
@api.route('/create_groups', methods=['POST'])
def create_groups():
    try:
        request_body = request.get_json()

        if not request_body or "name" not in request_body:
            return jsonify({"error": "Request body is empty"}), 400
        
        if len(request_body["name"]) < 1:
            return jsonify({"error": "Name is too short"}), 400
        
        group_duplicate = Groups.query.filter_by(name=request_body["name"]).first()
        if group_duplicate:
            return jsonify({"error": "Group already exists"}), 400
        
        group = Groups(name=request_body["name"], description=request_body.get("description"))
        db.session.add(group)
        db.session.commit()
        return jsonify(group.serialize()), 200  

    except Exception as e:
        return jsonify({"error": str(e)}), 500

# Cambiar el rol de un usuario una vez que cree el grupo
@api.route('change_rol/<int:id_user>', methods=['PUT'])
def change_rol(id_user):
    try:
        user = Users.query.filter_by(id_user=id_user).first()
        if not user:
            return jsonify({"error": "User not found"}), 404
        
        data = request.get_json()

        if 'id_rol' in data:
            user.id_rol = data['id_rol']
            db.session.commit()
            return jsonify({"success": "Rol changed successfully"}), 200
        else:
            return jsonify({"error": "Missing id_rol"}), 400

    except Exception as e:
        return jsonify({"error": str(e)}), 500
    
# Agregar usuario a un grupo
@api.route('/add_user_to_group/<int:id_user>', methods=['PUT'])
def add_user_to_group(id_user):
    try:
        user = Users.query.filter_by(id_user=id_user).first()
        if not user:
            return jsonify({"error": "User not found"}), 404
        
        data = request.get_json()
        if 'id_group' in data:
            group = Groups.query.filter_by(id_group=data['id_group']).first()
            if not group:
                return jsonify({"error": "Group not found"}), 404
            user.id_group = data['id_group']
            db.session.commit()
            return jsonify({"success": "User added to group successfully"}), 200
        
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    
# Eliminar usuario de un grupo
@api.route('/delete_user_from_group/<int:id_user>', methods=['DELETE'])
def delete_user_from_group(id_user):
    try:
        user = Users.query.filter_by(id_user=id_user).first()
        if not user:
            return jsonify({"error": "User not found"}), 404
        
        user.id_group = None
        db.session.commit()
        return jsonify({"success": "User deleted from group successfully"}), 200
    
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# Cambiar Nombre Grupo
@api.route('/rename_group/<int:id_group>', methods=['PUT'])
def rename_group(id_group):
    try:
        group = Groups.query.filter_by(id_group=id_group).first()
        if not group:
            return jsonify({"error": "Group not found"}), 404

        data = request.get_json()
        if 'name' in data:
            group.name = data['name']
            db.session.commit()
            return jsonify({"success": "Name change successfully"}), 200
    
    except Exception as e:
        return jsonify({"error": str(e)}), 500 

# Eliminar grupo
@api.route('/delete_group/<int:id_group>', methods=['DELETE'])
def delete_group(id_group):
    try:
        group = Groups.query.filter_by(id_group=id_group).first()
        if not group:
            return jsonify({"error": "Group not found"}), 404
        
        db.session.delete(group)
        db.session.commit()
        return jsonify({"success": "Group deleted"}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    
# Obtener el Grupo del usuario
@api.route('/get_user_group/<int:id_user>', methods=['GET'])
def get_user_group(id_user):
    try:
        # Busca al usuario en la base de datos
        user = Users.query.filter_by(id_user=id_user).first()
        if not user:
            return jsonify({"error": "User not found"}), 404

        # Busca el grupo asociado al usuario
        group = Groups.query.filter_by(id_group=user.id_group).first()
        if not group:
            return jsonify({"error": "Group not found for the user"}), 404

        # Retorna la información del grupo
        return jsonify(group.serialize()), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500

# Enviar invitación 
@api.route('/send_invitation', methods=['POST'])
def send_invitation():
    try:
        if mail is None:
            return jsonify({"error": "Mail service is not initialized"}), 500

        data = request.get_json()

        if "email" not in data or "id_group" not in data:
            return jsonify({"error": "Missing email or id_group"}), 400
        
        group = Groups.query.filter_by(id_group=data["id_group"]).first()
        if not group:
            return jsonify({"error": "Group not found"}), 404
        
        email_safe = data["email"].replace('.', 'DOT')
        
        # Crear el correo de invitación
        invite_link_accept = f"{FRONTEND_URL}api/accept_invitation/{data['id_group']}/{email_safe}"
        invite_link_reject = f"{FRONTEND_URL}"

        # Crear el mensaje
        message = Message(
            subject="¡Te han invitado a un grupo!",
            sender="safehaven4geeks@gmail.com",
            recipients=[data["email"]],
            html=f"""
                <h1>¡Hola!</h1>
                <p>Has sido invitado al grupo <b>{group.name}</b>.</p>
                <p>Haz clic en una de las opciones a continuación:</p>
                <a href="{invite_link_accept}">Aceptar Invitación</a>
                <br>
                <a href="{invite_link_reject}">Rechazar Invitación</a>
            """
        )

        # Enviar el correo
        mail.send(message)

        return jsonify({"success": "Invitation sent"}), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500

# Obtener el nombre del grupo
@api.route('/get_group_name/<int:id_group>', methods=['GET'])
def get_group_name(id_group):
    try:
        group = Groups.query.filter_by(id_group=id_group).first()
        if not group:
            return jsonify({"error": "Group not found"}), 404
        
        return jsonify({"name": group.name}), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500
    
# Obtener usuarios de un grupo
@api.route('/get_users_group/<int:id_group>', methods=['GET'])
def get_users_group(id_group):
    try:
        group = Groups.query.filter_by(id_group=id_group).first()
        if not group:
            return jsonify({"error": "Group not found"}), 404

        return jsonify([user.serialize() for user in group.user]), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500