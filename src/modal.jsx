import React from "react";

export default function Modal() {
    return (
        <div>

            <input type="checkbox" id="my-modal" className="modal-toggle" />
            <div className="modal">
                <div className="modal-box">
                    <h3 className="font-bold text-lg">tips and known bugs</h3>

                    <p className="py-4">
                        You can click anywhere on the map to get gas station's on a 4 mile radius from that point.
                    </p>

                    <p className="py-4">
                        click the upper right button and accept location permision to see where you are in the map
                    </p>

                    <p className="py-4">
                        When you click a gas station in the menu, the map will zoom into it.
                    </p>
                    <p className="py-4">
                        Sometimes you can't see the station; just manually zoom to see the station's icon show up in the map.
                    </p>

                    <div className="modal-action">
                        <label htmlFor="my-modal" className="btn">Yay!</label>
                    </div>
                </div>
            </div>
            <label htmlFor="my-modal" className="btn">tips and known bugs</label>


        </div>)
}