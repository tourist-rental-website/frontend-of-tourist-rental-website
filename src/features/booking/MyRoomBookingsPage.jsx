import {useEffect,useState} from "react";
import {
getMyRoomBookings,
cancelRoomBooking
} from "../../api/bookingApi";


const MyRoomBookingsPage=()=>{


const [bookings,setBookings]=useState([]);



const loadBookings=async()=>{

const data = await getMyRoomBookings();

setBookings(data);

};



useEffect(()=>{

loadBookings();

},[]);



const handleCancel=async(id)=>{

await cancelRoomBooking(id);

loadBookings();

};



return (

<div>

<h2>My Room Bookings</h2>


{
bookings.map((b)=>(

<div key={b.id}>

<h3>{b.room?.room_type}</h3>


<p>
Check-in: {b.check_in}
</p>


<p>
Check-out: {b.check_out}
</p>


<p>
Status: {b.status}
</p>


{
(b.status==="pending" ||
b.status==="confirmed") && (

<button onClick={()=>handleCancel(b.id)}>
Cancel
</button>

)}

</div>

))

}

</div>

);


};


export default MyRoomBookingsPage;