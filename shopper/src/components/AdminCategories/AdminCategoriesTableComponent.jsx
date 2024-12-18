import React, { useEffect, useState } from "react"

//MUI Components
import {
	Table,
	TableBody,
	TableCell,
	TableContainer,
	TableHead,
	TableRow,
	Paper,
	TablePagination,
	Box,
	IconButton,
	ListItem,
	Button
} from "@mui/material"

//MUI Icons
import DeleteIcon from "@mui/icons-material/Delete"
import EditIcon from "@mui/icons-material/Edit"
import AddIcon from "@mui/icons-material/Add"

import Chip from "@mui/material/Chip"
import SentimentSatisfiedAltIcon from "@mui/icons-material/SentimentSatisfiedAlt"
import SentimentVeryDissatisfiedIcon from "@mui/icons-material/SentimentVeryDissatisfied"
import CircularProgress from "@mui/material/CircularProgress"

//Categories Modal
import { useFirebase } from "../../context/DatabaseContext"
import AdminCategoryForm from "./AdminCategoryForm"
import FilterBar from "../ProductCategoryFilter/FilterBar"

const Filters = [
	{ key: 0, label: "All" },
	{ key: 1, label: "Active" },
	{ key: 2, label: "Inactive" }
]

const AdminCategoriesTableComponent = props => {
	const [filter, setFilter] = useState("Active")
	const [page, setPage] = useState(0)
	const [rowsPerPage, setRowsPerPage] = useState(5)
	const [categories, setCategories] = useState([])
	const [loading, setLoading] = useState(true)

	const [open, setOpen] = useState(false)
	const [editCategory, setEditCategory] = useState(null)

	const api = useFirebase()

	//Trae los datos del Firebase
	useEffect(() => {
		const fetchData = async () => {
			try {
				let querySnapshot = null

				if (filter === "Active") {
					querySnapshot = await api.getCategoriesByStatus(1)
				} else if (filter === "Inactive") {
					querySnapshot = await api.getCategoriesByStatus(0)
				} else {
					querySnapshot = await api.getAllCategories()
				}

				setCategories(querySnapshot)
				setLoading(false)
			} catch (error) {
				console.log("Error al Obtener Datos de Categorias de Firebase", error)
			}
		}

		fetchData()
		setEditCategory(null)
		setOpen(false)
	}, [loading, filter])

	//Elimina un elemento de la lista
	// Primero busca el elemento en la lista y lo elimina
	// Luego actualiza la base de datos
	const handleDelete = item => {
		//console.log("Desactivar categoria:", item)

		api.deactivateCategory(item.id).then(() => {
			setLoading(true)
		})
	}

	const handleEdit = item => {
		//Vamos a abrir el modal para editar la categoria seleccionada
		setEditCategory(item)
		setOpen(true)
	}

	const handleChangePage = (event, newPage) => {
		setPage(newPage)
	}

	const handleChangeRowsPerPage = event => {
		setRowsPerPage(parseInt(event.target.value, 10))
		setPage(0)
	}

	const handleOpenModal = item => {
		setEditCategory(item)
		setOpen(true)
	}

	const handleCloseModal = () => {
		setEditCategory(null)
		setOpen(false)
		setLoading(true)
	}

	const handleFilterChange = event => {
		setLoading(true)
		setFilter(event.target.innerText)
		//console.log("Filter: ", event.target.innerText)
	}

	const startIndex = page * rowsPerPage
	const endIndex = startIndex + rowsPerPage

	return (
		<>
			{loading ? (
				<Box sx={{ display: "flex" }}>
					<CircularProgress />
				</Box>
			) : (
				<>
					<FilterBar FilterList={Filters} filter={filter} handleFilterChange={handleFilterChange} />

					<Button variant="contained" onClick={() => handleOpenModal()} startIcon={<AddIcon />} sx={{mt:2, mb:2}}>
						Add Category
					</Button>


					<TableContainer component={Paper} >
						<Table>
							<TableHead>
								<TableRow>
									<TableCell>Name</TableCell>
									<TableCell className="hide-on-mobile ">Description</TableCell>
									<TableCell className="hide-on-mobile ">Status</TableCell>
									<TableCell className="hide-on-mobile ">Personalized Fields</TableCell>
									<TableCell className="hide-on-mobile ">Background Image</TableCell>
									<TableCell>Icon Image</TableCell>
									<TableCell>Actions</TableCell>
								</TableRow>
							</TableHead>

							<TableBody>
								{categories.slice(startIndex, endIndex).map((item, index) => (
									<TableRow key={item.id}>
										<TableCell>{item.name}</TableCell>
										<TableCell className="hide-on-mobile ">{item.description}</TableCell>
										{item.status === 1 ? (
											<TableCell className="hide-on-mobile " align="center">
												<Chip
													id="status-chip"
													icon={<SentimentSatisfiedAltIcon />}
													label="  Active"
													color="success"
													size="small"
												/>
											</TableCell>
										) : (
											<TableCell className="hide-on-mobile " align="center">
												<Chip
													id="status-chip"
													icon={<SentimentVeryDissatisfiedIcon />}
													label="Inactive"
													color="error"
													size="small"
												/>
											</TableCell>
										)}
										<TableCell className="hide-on-mobile " >{item.personalizedFields.length}</TableCell>
										<TableCell className="hide-on-mobile " >
											<img src={item.backgroundImage} width={"70px"} alt="BG" />
										</TableCell>
										<TableCell>
											<img src={item.icon} width={"70px"} alt="BG" />
										</TableCell>
										<TableCell>
											<Box sx={{ display: "flex", gap: 1 }}>
												<IconButton
													aria-label="delete"
													onClick={() => {
														handleDelete(item)
													}}>
													<DeleteIcon />
												</IconButton>

												<IconButton
													aria-label="edit"
													onClick={() => {
														handleEdit(item)
													}}>
													<EditIcon />
												</IconButton>
											</Box>
										</TableCell>
									</TableRow>
								))}
							</TableBody>
						</Table>
					</TableContainer>

					<TablePagination
						rowsPerPageOptions={[5, 10, 25]}
						component="div"
						count={categories.length}
						rowsPerPage={rowsPerPage}
						page={page}
						onPageChange={handleChangePage}
						onRowsPerPageChange={handleChangeRowsPerPage}
					/>

					<AdminCategoryForm setLoading={setLoading} open={open} closeModal={handleCloseModal} category={editCategory} />
				</>
			)}
		</>
	)
}

export default AdminCategoriesTableComponent
