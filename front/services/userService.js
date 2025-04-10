const API_URL = process.env.EXPO_PUBLIC_API_URL;

// Récupérer tous les utilisateurs
export const getAllUsers = async (token) => {
    try {
        const response = await fetch(`${API_URL}/users`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
        })

        if (!response.ok) {
            const errorData = await response.json()
            throw new Error(errorData.error || "Erreur lors de la récupération des utilisateurs")
        }

        return await response.json()
    } catch (error) {
        console.error("Erreur dans getAllUsers:", error)
        throw error
    }
}

// Créer un nouvel utilisateur
export const createUser = async (token, userData) => {
    try {
        const response = await fetch(`${API_URL}/users/register`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(userData),
        })

        if (!response.ok) {
            const errorData = await response.json()
            throw new Error(errorData.error || "Erreur lors de la création de l'utilisateur")
        }

        return await response.json()
    } catch (error) {
        console.error("Erreur dans createUser:", error)
        throw error
    }
}

// Mettre à jour un utilisateur
export const updateUser = async (token, userId, userData) => {
    try {
        const response = await fetch(`${API_URL}/users/${userId}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(userData),
        })

        if (!response.ok) {
            const errorData = await response.json()
            throw new Error(errorData.error || "Erreur lors de la mise à jour de l'utilisateur")
        }

        return await response.json()
    } catch (error) {
        console.error("Erreur dans updateUser:", error)
        throw error
    }
}

// Supprimer un utilisateur
export const deleteUser = async (token, userId) => {
    try {
        const response = await fetch(`${API_URL}/users/${userId}`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
        })

        if (!response.ok) {
            const errorData = await response.json()
            throw new Error(errorData.error || "Erreur lors de la suppression de l'utilisateur")
        }

        return await response.json()
    } catch (error) {
        console.error("Erreur dans deleteUser:", error)
        throw error
    }
}
