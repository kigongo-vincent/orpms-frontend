import React from 'react'
import UserNavigation from '../../components/UserNavigation'
import { Button, Container, Typography } from '@mui/material'
import { Delete, Edit } from '@material-ui/icons'
import { FaDownload } from 'react-icons/fa'
import DocViewer from 'react-doc-viewer'
const Report = () => {

    const docs = [
        {
            uri: "https://kigongovincent.pythonanywhere.com/static/pdf.pdf"
        }
    ]
    return (
        <div>
            <UserNavigation />
            <Container sx={{ mt: 15 }} >
                <Typography variant="h4" lineHeight={2} fontWeight={"bold"}>Post Harvest Portal in Uganda (draft)</Typography>
                <Typography lineHeight={2}>Uploaded 20 mins ago, by @vincent</Typography>
                <Typography lineHeight={2} variant='caption'>Last updated, 8 minutes ago</Typography>
                <hr />
                <Button startIcon={<Edit />} variant='contained' color="primary">
                    update
                </Button>
                <Button sx={{ ml: 1 }} startIcon={<FaDownload size={15} />} variant='contained' color="secondary">
                    download
                </Button>

                <DocViewer className='mt-4' documents={docs} />
            </Container>
        </div>
    )
}

export default Report