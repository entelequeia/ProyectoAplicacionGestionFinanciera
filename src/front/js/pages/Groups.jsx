import React, { useContext, useEffect, useState } from 'react'
import { Context } from '../store/appContext'

export function Groups() {
  const [name, setName] = useState()
  const [description, setDescription] = useState()
  const [message, setMessage] = useState()
  const [showMessage, setShowMessage] = useState(false)
  const { store, actions } = useContext(Context)
  const [group, setGroup] = useState(() => {
    const savedGroup = localStorage.getItem('group');
    return savedGroup ? JSON.parse(savedGroup) : null;
  });

  console.log('inicio user', store.userData)
  console.log('inicio grupo', group)

  useEffect(() => {
    checkGroups()
  }, [group]);

  // Comprobar si el usuario pertenece a un grupo
  const checkGroups = async () => {
    if (!group) {
      setMessage('No perteneces a ningún grupo, puedes crear uno nuevo')
      setShowMessage(true)
    } else {
      setMessage('Ya perteneces a un grupo: ' + group.name)
      setShowMessage(true)
    }
  }

  // Añadir usuario al grupo pasandole el id del grupo almadenado en el estado
  const addUserToGroup = async ({ id_group }) => {
    try {
      const response = await fetch(`${process.env.BACKEND_URL || 'http://localhost:3001/'}api/add_user_to_group/${store.userData.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 'id_group': id_group }),
      })

      const data = await response.json()
      if (response.status === 200) {
        console.log('HECHO', data)
        changeRol()
      }

      if (response.status !== 200) {
        console.log(data)
      }
    } catch (error) {
      console.log('Error al añadir usuario al grupo', error)
    }
  }

  // Crear grupo pasandole el nombre y la descripción
  const createGroup = async ({ name, description }) => {
    try {
      const response = await fetch(`${process.env.BACKEND_URL || 'http://localhost:3001/'}api/create_groups`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 'name': name, 'description': description })
      })

      const data = await response.json()
      if (response.status === 200) {
        localStorage.setItem('group', JSON.stringify(data))
        setGroup(data)
        await addUserToGroup({ id_group: data.id })
      }

      if (response.status !== 200) {
        console.log('Error al crear grupo', response)
      }
    } catch (error) {
      console.log('Error al crear grupo', error)
    }
  }

  const changeRol = async () => {
    try {
      const response = await fetch(`${process.env.BACKEND_URL || 'http://localhost:3001/'}api/change_rol/${store.userData.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ "id_rol": 1 }) // 1 es el id del rol de administrador,
      })

      const data = await response.json()
      if (response.status === 200) {
        console.log('HECHO', data)
      }
      
      if (response.status !== 200) {
        console.log(data)
      }
    } catch (error) {
      console.log('Error al cambiar rol', error)
    }
  }

  // Manejar el evento de submit del formulario de creación de grupo y llamar a la función de creación de grupo
  const handleSubmit = (e) => {
    e.preventDefault()
    createGroup({ name, description })
  }

  return (
    <div>
      {showMessage &&
        <div>
          <div className="alert alert-warning" role="alert">{message}</div>
          <button type="button" className="btn btn-primary" data-bs-toggle="modal" data-bs-target="#exampleModal">
            Crear grupo
          </button>

          <div className="modal fade" id="exampleModal" aria-labelledby="exampleModalLabel" aria-hidden="true">
            <div className="modal-dialog">
              <div className="modal-content">
                <div className="modal-header">
                  <h1 className="modal-title fs-5" id="exampleModalLabel">Nuevo Grupo</h1>
                  <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div className="modal-body">
                  <form>
                    <div className="mb-3">
                      <label htmlFor="name" className="form-label">Nombre</label>
                      <input type="text" className="form-control" id="name" onChange={(e) => setName(e.target.value)} />
                    </div>
                    <div className="mb-3">
                      <label htmlFor="description" className="form-label">Descripción</label>
                      <textarea className="form-control" id="description" rows="3" onChange={(e) => setDescription(e.target.value)}></textarea>
                    </div>
                  </form>
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                  <button type="button" className="btn btn-primary" onClick={handleSubmit}>Save changes</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      }
    </div>
  )
}
