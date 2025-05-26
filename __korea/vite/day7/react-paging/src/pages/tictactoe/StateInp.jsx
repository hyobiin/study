import { useState } from "react";

export default function Test(){
    const [firstName, setFirstName] = useState('Jane');
    const [lastName, setLastName] = useState('Jacobs');
    const [isEditing, setIsEditing] = useState(false);

    // 페이지
    return(
        <form id="form">
            <label>
                First name:
                {isEditing ? (
                    <input
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                    />
                ) : (
                    <b>{firstName}</b>
                )}
            </label>
            <br />
            <label>
                Last name:
                {isEditing ? (
                    <input
                        id="lastNameInput"
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                    />
                ) : (
                    <b>{lastName}</b>
                )}
            </label>
            <br />
            <button
                type="button"
                onClick={() => {
                    setIsEditing(!isEditing);
                }}
            >
                {isEditing ? 'Save Profile' : 'Edit Profile'}
            </button>
            {!isEditing && (
                <p>Hello, {firstName} {lastName}!</p>
            )}
        </form>
    )
}
