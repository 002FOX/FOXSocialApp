import User from "../models/user.js"

export const getUserController = async (req, res) => {
    
    try {
        
        const { id } = req.params;
        const user = await User.findById(id);
        res.status(200).json(user);

    }catch(error){
        res.status(404).json({ message: error.message })
    }
}

export const getUserFriendsController = async (req, res) => {

    try{

        const { id } = req.params;
        const user = await User.findById(id).populate('friends');
        res.status(200).json(user.friends);

    }catch(error){
        res.status(404).json({ message: error.message })
    }
}

export const addFriendController = async (req, res) => {

    try{

        const { id, friendId } = req.params;
        const user = await User.findById(id);
        const friend = await User.findById(friendId);

        if(user.friends.includes(friend)){
            res.status(409).send('You are already friends!');
        }

        user.friends.push(friendId);
        friend.friends.push(id);
        await user.save();
        await friend.save();
         
    }catch(error){
        res.status(404).send({ message: error.message });
    }
}

export const deleteFriendController = async (req, res) => {

    try{
        
        const { id, friendId} = req.params;
        const user = await User.findById(id);
        const friend = await User.findById(friendId);

        if(user.friends.includes(friend)){

            user.friends = user.friends.filter((id) => { id !== friendId });
            friend.friends = friend.friends.filter((id) => { id !== id });

        }else{

            res.status(409).send("You are not friends!");

        }

    }catch(error){
        res.status(404).send( { message: error.message });
    }
}