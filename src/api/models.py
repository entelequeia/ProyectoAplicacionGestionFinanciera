from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()

class Users(db.Model):
    id_user = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(80), unique=False, nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password = db.Column(db.String(80), unique=False, nullable=False)
    id_group = db.Column(db.Integer, db.ForeignKey('groups.id_group'), nullable=True)
    id_rol = db.Column(db.Integer, db.ForeignKey('roles.id_rol'), nullable=False)

    def __repr__(self):
        return f'<User {self.email}>'

    def serialize(self):
        return {
            "id": self.id_user,
            "name": self.name,
            "email": self.email,
            "id_group": self.id_group,
            "id_rol": self.id_rol
            }
    
class Groups(db.Model):
    id_group = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(80), unique=True, nullable=False)
    description = db.Column(db.String(120), unique=False, nullable=True)

    def __repr__(self):
        return f'<Group {self.name}>'

    def serialize(self):
        return {
            "id": self.id_group,
            "name": self.name,
            "description": self.description,
            }
    
class Roles(db.Model):
    id_rol = db.Column(db.Integer, primary_key=True)
    rol = db.Column(db.String(80), unique=True, nullable=False)

    def __repr__(self):
        return f'<Role {self.rol}>'

    def serialize(self):
        return {
            "id": self.id_rol,
            "rol": self.rol
            }
    
class Finances(db.Model):
    id_finance = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(80), unique=True, nullable=False)
    amount = db.Column(db.Float, nullable=False)
    date = db.Column(db.DateTime, nullable=False)
    description = db.Column(db.String(120), nullable=True)
    id_category = db.Column(db.Integer, db.ForeignKey('categories.id_category'), nullable=False)
    id_user = db.Column(db.Integer, db.ForeignKey('users.id_user'), nullable=False)
    id_type = db.Column(db.Integer, db.ForeignKey('types.id_type'), nullable=False)

    def __repr__(self):
        return f'<Finance {self.name}>'

    def serialize(self):
        return {
            "id": self.id_finance,
            "name": self.name,
            "amount": self.amount,
            "date": self.date,
            "description": self.description,
            "id_category": self.id_category,
            "id_user": self.id_user,
            "id_type": self.id_type
            }
    
class Categories(db.Model):
    id_category = db.Column(db.Integer, primary_key=True)
    categorie = db.Column(db.String(80), unique=True, nullable=False)

    def __repr__(self):
        return f'<Category {self.categorie}>'

    def serialize(self):
        return {
            "id": self.id_category,
            "categorie": self.categorie
            }
    
class Types(db.Model):
    id_type = db.Column(db.Integer, primary_key=True)
    type = db.Column(db.String(80), unique=True, nullable=False)

    def __repr__(self):
        return f'<Type {self.type}>'

    def serialize(self):
        return {
            "id": self.id_type,
            "type": self.type
            }
    
class Group_Finances(db.Model):
    id_group_finance = db.Column(db.Integer, primary_key=True)
    id_group = db.Column(db.Integer, db.ForeignKey('groups.id_group'), nullable=False)
    id_finance = db.Column(db.Integer, db.ForeignKey('finances.id_finance'), nullable=False)
    create_by = db.Column(db.Integer, db.ForeignKey('users.id_user'), nullable=False)
    date = db.Column(db.DateTime, nullable=False)

    def __repr__(self):
        return f'<Group_Finance {self.id_group} - {self.id_finance} from {self.create_by}>'

    def serialize(self):
        return {
            "id": self.id_group_finance,
            "id_group": self.id_group,
            "id_finance": self.id_finance,
            "create_by": self.create_by,
            "date": self.date
            }