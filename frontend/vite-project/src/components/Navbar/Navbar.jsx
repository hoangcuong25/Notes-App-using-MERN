import React, { useState } from 'react'
import ProfileInfo from '../Cards/ProfileInfo'
import { useNavigate } from 'react-router-dom'
import SearchBar from '../SearchBar/SearchBar'

const Navbar = ({userInfo}) => {

    const [searchQuery, setSearchQuery] = useState("")

    const Navigate = useNavigate()

    const onLogout = () => {
        localStorage.clear()
        Navigate("/login");
    }

    const handleSearch = () => {

    }

    const onClearSearch = () => {
        setSearchQuery("")
    }

    return (
        <div className='bg-white flex items-center justify-between px-6 py-2 drop-shadow'>
            <h2 className='text-xl font-medium text-black py-2'>Notes</h2>

            <SearchBar
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                handleSearch={handleSearch}
                onClearSearch={onClearSearch}
            />

            <ProfileInfo onLogout={onLogout} userInfo={userInfo}/>
        </div>
    )
}

export default Navbar