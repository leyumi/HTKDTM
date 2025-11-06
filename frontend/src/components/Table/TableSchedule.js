import React from "react";

const TableSchedule = () => {
    const timeSlots = [
        { session: "Sáng", periods: ["7:00 - 7:50", "7:55 - 8:45", "8:50 - 9:40", "9:45 - 10:35", "10:40 - 11:30", "11:35 - 12:25"] },
        { session: "Chiều", periods: ["12:55 - 13:45", "13:50 - 14:40", "14:45 - 15:35", "15:40 - 16:30", "16:35 - 17:25", "17:30 - 18:20"] },
        { session: "Tối", periods: ["18:50 - 19:40", "19:45 - 20:35", "20:40 - 21:30", "21:35 - 22:25", "22:30 - 23:20"] },
    ];

    const days = ["Thứ 2", "Thứ 3", "Thứ 4", "Thứ 5", "Thứ 6", "Thứ 7", "Chủ nhật"];

    return (
        <div className="container-fluid">
        <div className="table-responsive">
            <table className="table table-bordered text-center rounded-3 overflow-hidden table-md fs-7">
            <thead className="">
                <tr className="table-dark" style={{ backgroundColor: "#f28c8c" }}>
                <th rowSpan="2" className="align-middle">Buổi</th>
                <th rowSpan="2" className="align-middle">Thời gian</th>
                {days.map((day) => (
                    <th key={day}>{day}</th>
                ))}
                </tr>
            </thead>
            <tbody>
                {timeSlots.map((slot, slotIndex) => (
                <React.Fragment key={slotIndex}>
                    {/* Row for session */}
                    <tr>
                    <td rowSpan={slot.periods.length + 1} className="align-middle fw-bold">
                        {slot.session}
                    </td>
                    </tr>
                    {/* Rows for periods */}
                    {slot.periods.map((period, periodIndex) => (
                    <tr key={periodIndex}>
                        <td className="align-middle">
                            <span className="fw-bold">Tiết {slotIndex * 6 + periodIndex + 1}</span>
                            <br />
                            {period}
                        </td>
                        {days.map((day, dayIndex) => (
                        <td key={dayIndex}></td>
                        ))}
                    </tr>
                    ))}
                </React.Fragment>
                ))}
            </tbody>
            </table>
        </div>
        </div>
    );
};

export default TableSchedule;
