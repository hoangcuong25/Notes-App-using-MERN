import React, { useEffect, useState } from 'react'
import Navbar from '../../components/Navbar/Navbar'
import NoteCard from '../../components/Cards/NoteCard'
import { MdAdd } from 'react-icons/md'
import AddEditNote from './AddEditNote'
import Modal from "react-modal"
import { useNavigate } from 'react-router-dom'
import axiosInstance from '../../utils/axiosInstance'
import EmptyCard from '../../components/EmptyCard/EmptyCard'

const Home = () => {

    const [openAddEditModal, setOpenAddEditModal] = useState({
        isShown: false,
        type: "add",
        data: null
    })

    const [allNotes, setAllNotes] = useState([])
    const [userInfo, setUserInfo] = useState(null)

    const [isSearch, setIsSearch] = useState(false)

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

    //delete note 
    const deleteNote = async (data) => {
        const noteId = data._id
        try {
            const res = await axiosInstance.delete("/delete-note/" + noteId)

            if (res.data && !res.data.error) {
                getAllNotes()
            }
        } catch (error) {
            if (error.res && error.res.data && error.res.data.message) {
                console.log("An unexpected error occurred")
            }
        }
    }

    // Search for a note
    const onSearchNote = async (query) => {
        try {
            const res = await axiosInstance.get("/search-notes", {
                params: { query },
            })

            if (res.data && res.data.notes) {
                setIsSearch(true);
                setAllNotes(res.data.notes)
            }
        } catch (error) {
            console.log(error)
        }
    }

    const updateIsPinned = async (noteData) => {
        const noteId = noteData._id

        try {
            const res = await axiosInstance.put("/update-note-pinned/" + noteId, {
                isPinned: !noteData.isPinned
            })

            if (res.data && res.data.note) {
                getAllNotes()
            }
        } catch (error) {
            console.log(error)
        }
    }

    const handleClearSearch = () => {
        setIsSearch(false)
        getAllNotes()
    }

    useEffect(() => {
        getAllNotes()
        getUserInfo()
        return () => { }
    }, [])

    return (
        <div>
            <Navbar userInfo={userInfo}
                onSearchNote={onSearchNote}
                handleClearSearch={handleClearSearch} />

            <div className='container mx-auto'>
                {allNotes.length > 0 ? (<div className='grid grid-cols-3 gap-4 mt-8'>
                    {allNotes.map((item, index) => (
                        <NoteCard
                            key={item._id}
                            title={item.title}
                            date={item.createOn}
                            content={item.content}
                            tags={item.tags}
                            isPinned={item.isPinned}
                            onEdit={() => handleEdit(item)}
                            onDelete={() => deleteNote(item)}
                            onPinNote={() => updateIsPinned(item)}
                        />
                    ))}
                </div>) : (<EmptyCard />)}
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

        </div>
    )
}

export default Home