export const UpdateKeyProvider = ({ children, onUpdateKey }) => {
    const [updateKey, setUpdateKey] = useState(localStorage.getItem('updatekey') || '');

    useEffect(() => {
        if (onUpdateKey) {
            onUpdateKey(updateKey);
        }
    }, [updateKey, onUpdateKey]);

    const updateLocalStorage = (key, value) => {
        localStorage.setItem(key, value);
        if (key === 'updatekey') {
            setUpdateKey(value);
        }
    };

    return (
        <UpdateKeyContext.Provider value={{ updateKey, updateLocalStorage }}>
            {children}
        </UpdateKeyContext.Provider>
    );
};
