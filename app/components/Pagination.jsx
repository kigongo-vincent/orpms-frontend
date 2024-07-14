import React from 'react'
import {motion} from 'framer-motion'
import { FaAngleLeft, FaAngleRight } from 'react-icons/fa'
const Pagination = ({currentPage, projectsPerPage,setCurrentPage, projects}) => {

    const paginate = (pageNumber) => {
        if (pageNumber < 1 || pageNumber > Math.ceil(projects.length / projectsPerPage)) {
            return;
        }
        setCurrentPage(pageNumber);
    };
  return (
    <div className='d-flex align-items-center'>
                        <motion.p
                            className='mx-2'
                            onClick={() => paginate(currentPage - 1)}
                            style={{ cursor: currentPage === 1 ? 'not-allowed' : 'pointer' }}
                            
                        >
                            <FaAngleLeft className='mx-1' />
                            prev
                        </motion.p>
                        {Array(Math.ceil(projects.length / projectsPerPage))
                            .fill()
                            .map((_, i) => (
                                <motion.p
                                role = 'button'
                                    key={i}
                                    className={` px-2  d-flex align-items-center justify-content-center rounded ${currentPage === i + 1 && 'bg-danger text-light'}`}
                                    style={{ cursor: currentPage === i + 1 ? 'not-allowed' : 'pointer' }}
                                    onClick={() => paginate(i + 1)}
                                    // whileHover={{ scale: 1.1 }}
                                    // whileTap={{ scale: 0.9 }}
                                >
                                    {i + 1}
                                </motion.p>
                            ))}
                        <motion.p
                        role='button'
                            className='mx-2'
                            onClick={() => paginate(currentPage + 1)}
                            style={{ cursor: currentPage === Math.ceil(projects.length / projectsPerPage) ? 'not-allowed' : 'pointer' }}
                            // whileHover={{ scale: 1.1 }}
                            // whileTap={{ scale: 0.9 }}
                        >
                            next
                            <FaAngleRight className='mx-1' />
                        </motion.p>
                    </div>
    )
}

export default Pagination