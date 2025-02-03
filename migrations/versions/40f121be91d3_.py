"""empty message

Revision ID: 40f121be91d3
Revises: 143e8b76c54c
Create Date: 2025-02-01 16:42:16.839178

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '40f121be91d3'
down_revision = '143e8b76c54c'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table('finances', schema=None) as batch_op:
        batch_op.alter_column('id_type',
               existing_type=sa.INTEGER(),
               nullable=True)
        batch_op.drop_constraint('finances_name_key', type_='unique')

    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table('finances', schema=None) as batch_op:
        batch_op.create_unique_constraint('finances_name_key', ['name'])
        batch_op.alter_column('id_type',
               existing_type=sa.INTEGER(),
               nullable=False)

    # ### end Alembic commands ###
