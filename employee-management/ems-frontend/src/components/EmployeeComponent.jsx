import React, { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { createEmployee, getEmployee, updateEmployee } from '../services/EmployeeService'
import { useNavigate, useParams } from 'react-router-dom'

const employeeSchema = z.object({
    firstName: z.string().trim().min(1, 'First name is required'),
    lastName: z.string().trim().min(1, 'Last name is required'),
    email: z.string().trim().min(1, 'Email is required').email('Enter a valid email address')
})

const EmployeeComponent = () => {
    const { id } = useParams()
    const navigate = useNavigate()
    const {
        register,
        handleSubmit,
        reset,
        formState: { errors, isSubmitting, isValid }
    } = useForm({
        resolver: zodResolver(employeeSchema),
        defaultValues: { firstName: '', lastName: '', email: '' }
    })

    useEffect(() => {
        if (id) {
            getEmployee(id).then((response) => {
                reset({
                    firstName: response.data.firstName ?? '',
                    lastName: response.data.lastName ?? '',
                    email: response.data.email ?? ''
                })
            }).catch((error) => {
                console.error(error)
            })
        }
    }, [id, reset])

    async function saveOrUpdateEmployee(employee) {
        try {
            if (id) {
                await updateEmployee(id, employee)
            } else {
                await createEmployee(employee)
            }
            navigate('/employees')
        } catch (error) {
            console.error(error)
        }
    }

    return (
        <div className='container'>
            <br /> <br />
            <div className='row'>
                <div className='card col-md-6 offset-md-3 offset-md-3'>
                    <h2 className='text-center'>{id ? 'Update Employee' : 'Add Employee'}</h2>
                    <div className='card-body'>
                        <form onSubmit={handleSubmit(saveOrUpdateEmployee)} noValidate>
                            <div className='form-group mb-2'>
                                <label htmlFor='firstName' className='form-label'>First Name:</label>
                                <input
                                    id='firstName'
                                    type='text'
                                    placeholder='Enter Employee First Name'
                                    className={`form-control ${errors.firstName ? 'is-invalid' : ''}`}
                                    {...register('firstName')}
                                />
                                {errors.firstName && <div className='invalid-feedback'>{errors.firstName.message}</div>}
                            </div>

                            <div className='form-group mb-2'>
                                <label htmlFor='lastName' className='form-label'>Last Name:</label>
                                <input
                                    id='lastName'
                                    type='text'
                                    placeholder='Enter Employee Last Name'
                                    className={`form-control ${errors.lastName ? 'is-invalid' : ''}`}
                                    {...register('lastName')}
                                />
                                {errors.lastName && <div className='invalid-feedback'>{errors.lastName.message}</div>}
                            </div>

                            <div className='form-group mb-2'>
                                <label htmlFor='email' className='form-label'>Email:</label>
                                <input
                                    id='email'
                                    type='email'
                                    placeholder='Enter Employee Email'
                                    className={`form-control ${errors.email ? 'is-invalid' : ''}`}
                                    {...register('email')}
                                />
                                {errors.email && <div className='invalid-feedback'>{errors.email.message}</div>}
                            </div>

                            <button className='btn btn-success' type='submit' disabled={isSubmitting || !isValid}>
                                {isSubmitting ? 'Submitting...' : 'Submit'}
                            </button>
                            <button className='btn btn-outline-secondary ms-2' type='button' onClick={() => reset()}>
                                Clear
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default EmployeeComponent
