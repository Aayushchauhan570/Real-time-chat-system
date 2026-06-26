
export const createGroup = async (req, res) => {
    const groupData = req.body;
    try {
        const group = await createGroupService(groupData);
        res.status(201).json({ message: 'Group created successfully', group });
    } catch (error) {
        console.error('Error creating group:', error);
        res.status(500).json({ message: 'Error creating group', error: error.message });
    }
}