import { DeleteContext } from "@/context/deleteContext";
import { IP_ADDRESS } from "@/src/api";
import { AntDesign } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useContext } from "react";
import { Alert, Pressable } from "react-native";

type DeleteButtonProps = {
    id: string;
}

export function DeleteButton({ id }: DeleteButtonProps) {
    const { setWasDeleted, setIdDeletedPlaylist } = useContext(DeleteContext);
    const router = useRouter();

    const deletePlaylist = async (id: string): Promise<boolean> => {
        if (!IP_ADDRESS) {
            throw new Error(`Dirección IP no configurada`)
        }
        const response = await fetch(
            `http://${IP_ADDRESS}/api/playlist/${id}`,
            { method: 'DELETE' }
        );
        if (!response.ok) {
            throw new Error(`HTTP Error: ${response.status}`)
        }
        return true;
    };

    const handleDelete = (id: string) => {
        Alert.alert(
            'Eliminar playlist',
            '¿Estás seguro de que querés eliminar esta playlist?',
            [
                { text: 'Cancelar', style: 'cancel' },
                {
                    text: 'Eliminar',
                    style: 'destructive',
                    onPress: async () => {
                        try {
                            await deletePlaylist(id);
                            setIdDeletedPlaylist(parseInt(id));
                            setWasDeleted(true);
                            router.back();
                        } catch (error) {
                            Alert.alert('Error', 'No se pudo eliminar la playlist.');
                        }
                    }
                }
            ]
        );
    }

    return (
        <Pressable style={styles.button} onPress={() => handleDelete(id)}>
            <AntDesign color='#ff0000ff' name="delete" size={20}></AntDesign>
        </Pressable>
    );
}

const styles = {
    button: {
        marginRight: 20, 
    },
};