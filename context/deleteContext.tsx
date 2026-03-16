import React, { createContext, PropsWithChildren, useState } from 'react';

type DeleteContextType = {
  wasDeleted: boolean;
  setWasDeleted: React.Dispatch<React.SetStateAction<boolean>>;
  idDeletedPlaylist: number;
  setIdDeletedPlaylist: React.Dispatch<React.SetStateAction<number>>;
};

export const DeleteContext = createContext<DeleteContextType>({
    wasDeleted: false,
    setWasDeleted: () => {},
    idDeletedPlaylist: 0,
    setIdDeletedPlaylist: () => {},
});

export const DeleteProvider = ({ children }: PropsWithChildren) => {
    const [wasDeleted, setWasDeleted] = useState(false);
    const [idDeletedPlaylist, setIdDeletedPlaylist] = useState(0);

    return (
        <DeleteContext.Provider value={{wasDeleted, setWasDeleted, idDeletedPlaylist, setIdDeletedPlaylist}}>
            {children}
        </DeleteContext.Provider>
    );
};