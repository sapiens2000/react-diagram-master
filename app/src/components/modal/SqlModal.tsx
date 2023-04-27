import React from 'react';
import styled from '@emotion/styled';

export const Modal = styled.div`
    box-shadow: 0 0 0 4px rgba(0, 0, 0, 0.2);
    margin-top: 15px;
    background: #fff;
    width: 500px;
    border-radius: 12px;
    position: relative;
    padding: 8px;
    box-sizing: border-box;
    text-align: center;
    align-items: center;
    justify-content: space-between;
	`;

export interface SqlModalProps {
    setSql: (sql: string) => void;
    setOnModal: (state: boolean) => void;
};

const SqlModal: React.FC<SqlModalProps> = (props : SqlModalProps) => {

    const handleSave = (sql: string) => {
        alert('저장');        
        props.setSql(sql);
        props.setOnModal(false);
    }

    return (
/*         <Container>
           <FormControl>
                <FormLabel>SQL</FormLabel>
                <TextField
                    onChange={() => handleSave((event.target as HTMLInputElement).value)}
                    placeholder="..."
                    minRows={3}
                    enddecorator={
                    <Box
                        sx={{
                            display: 'flex',
                            gap: 'var(--Textarea-paddingBlock)',
                            pt: 'var(--Textarea-paddingBlock)',
                            borderTop: '1px solid',
                            borderColor: 'divider',
                            flex-direction: 'column',
                        }}
                    >
                    </Box>
                    }
                />
            </FormControl>
        </Container> */
        <div>
            <p>test</p>
        </div>
    )
};

export default SqlModal;
