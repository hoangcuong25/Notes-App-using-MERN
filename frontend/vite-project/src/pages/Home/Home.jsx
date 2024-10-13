import React, { useEffect, useState } from 'react'
import Navbar from '../../components/Navbar/Navbar'
import NoteCard from '../../components/Cards/NoteCard'
import { MdAdd } from 'react-icons/md'
import AddEditNote from './AddEditNote'
import Modal from "react-modal"
import { useNavigate } from 'react-router-dom'
import axiosInstance from '../../utils/axiosInstance'
import Toast from '../../components/ToastMessage/Toast'

const Home = () => {

    const [openAddEditModal, setOpenAddEditModal] = useState({
        isShown: false,
        type: "add",
        data: null
    })

    const [showToastMsg, setShowToastMsg] = useState({
        isShown: false,
        message: "",
        type: "add"
    })

    const showToastMessage = (message ,type) => {
        setShowToastMsg({
            isShown: true,
            message,
            type
        })
    }

    const handleCloseToast = () => {
        setShowToastMsg({
            isShown: false,
            message: "",
        })
    }

    const [allNotes, setAllNotes] = useState([])
    const [userInfo, setUserInfo] = useState(null)

    const navigate = useNavigate()

    const handleEdit = (noteDetails) => {
        setOpenAddEditModal({
            isShown: true,
            data: noteDetails,
            type: "edit"
        });
    };


    // get user Info
    const getUserInfo = async () => {
        try {
            const res = await axiosInstance.get("/get-user")
            if (res.data && res.data.user) {
                setUserInfo(res.data.user)
            }
        } catch (error) {
            if (error.res.status === 401) {
                localStorage.clear();
                navigate("/login")
            }
        }
    }

    //get all notes
    const getAllNotes = async () => {
        try {
            const res = await axiosInstance.get("/get-all-notes")

            if (res.data && res.data.notes) {
                setAllNotes(res.data.notes)
            }
        } catch {
            console.log("An unexpected error occurred")
        }
    }

    useEffect(() => {
        getAllNotes()
        getUserInfo()
        return () => { }
    }, [])

    return (
        <div>
            <Navbar userInfo={userInfo} />

            <div className='container mx-auto'>
                <div className='grid grid-cols-3 gap-4 mt-8'>
                    {allNotes.map((item, index) => (
                        <NoteCard
                            key={item._id}
                            title={item.title}
                            date={item.createOn}
                            content={item.content}
                            tags={item.tags}
                            isPinned={item.isPinned}
                            onEdit={() => handleEdit(item)}
                            onDelete={() => { }}
                            onPinNote={() => { }}
                        />
                    ))}
                </div>
            </div>

            <button className='w-16 h-16 flex items-center justify-center 
            rounded-2xl bg-primary hover:bg-blue-600 absolute right-10 bottom-10'
                onClick={() => {
                    setOpenAddEditModal({ isShown: true, type: "add", data: null })
                }}>
                <MdAdd className='text-[32px] text-white' />
            </button>

            <Modal
                isOpen={openAddEditModal.isShown}
                onRequestClose={() => { }}
                style={{
                    overlay: {
                        backgroundColor: "rgba(0,0,0,0.2)"
                    }
                }}
                contentLabel=""
                className="w-[40%] max-h-3/4 bg-white rounded-md mx-auto mt-14 p-5 overflow-scroll"
            >

                <AddEditNote
                    type={openAddEditModal.type}
                    noteData={openAddEditModal.data}
                    onClose={() => {
                        setOpenAddEditModal({ isShown: false, type: "add", data: null })
                    }}
                    getAllNotes={getAllNotes}
                />
            </Modal>

            <Toast
                isShown={showToastMsg.isShown}
                message={showToastMsg.message}
                type={showToastMsg.type}
                onClose={handleCloseToast}
            />
        </div>
    )
}

export default Home