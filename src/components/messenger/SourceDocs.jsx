import {useState} from 'react';

import ReactMarkdown from "react-markdown";
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import Typography from '@mui/material/Typography';
import IconButton  from '@mui/material/IconButton';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import SourceOutlinedIcon from '@mui/icons-material/SourceOutlined';
import { useTheme } from '@mui/system';

export default function SourceDocs({sourceDocs, index}) {
    const theme = useTheme()
 const [open, setOpen] = useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <>
    <IconButton
    sx={{ p: 1, }}
              size="small"
              color="primary"
              onClick={handleClickOpen}
            >
              <SourceOutlinedIcon color="secondary" fontSize="small" />
            </IconButton>
      
      <Dialog
        open={open}
        onClose={handleClose}
      >
        <DialogTitle sx={{ backgroundColor: theme.palette.background.alt }}>{`Source Documents for message ${index}`}</DialogTitle>
        <DialogContent sx={{ backgroundColor: theme.palette.background.alt }}>
          
          <Box
            noValidate
            component="form"
            sx={{
              display: 'flex',
              flexDirection: 'column',
              m: 'auto',
              width: 'fit-content',
            }}
          >
      {sourceDocs.map((doc, i)=>(<Accordion sx={{ backgroundColor: theme.palette.background.dark }}  key={`messageSourceDocs-${i}`}>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel1a-content"
          id="panel1a-header"
        >
          <Typography>Source {i + 1}</Typography>
        </AccordionSummary>
        <AccordionDetails>
            <ReactMarkdown linkTarget="_blank">
                                      {doc.pageContent}
                                    </ReactMarkdown>
           
            
          <Typography>
             <b>Source:</b> {doc.metadata.source.substring(22)}
          </Typography>
        </AccordionDetails>
      </Accordion>))}
            
          </Box>
        </DialogContent>
        <DialogActions sx={{ backgroundColor: theme.palette.background.alt }}>
          <Button color="inherit" onClick={handleClose}>Close</Button>
        </DialogActions>
      </Dialog>
    </>
  );
}