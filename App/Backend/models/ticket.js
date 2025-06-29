import mongoose from 'mongoose';
const Schema = mongoose.Schema;
//Layout of each ticket object
const ticketSchema = new Schema({
    orderNumber: {
        type: String,
        required: true,
    },
    dateCreated: {
        type: Date,
        required: true,
    },
    orderItems: {
        type: Array,
        required: true,
    },
    totalPayment: {
        type: Number,
        required: true,
    },
    status: {
        type: String,
        required: true,
    }
});
export default mongoose.model('ticket', ticketSchema);
//# sourceMappingURL=ticket.js.map