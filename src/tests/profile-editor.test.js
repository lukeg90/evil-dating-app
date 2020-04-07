import React from "react";
import ProfileEditor from "../profile-editor";
import { render, fireEvent, waitForElement } from "@testing-library/react";
import axios from "../axios";

test("When no profile props passed to it, an 'Add' button is rendered", () => {
    const { container } = render(<ProfileEditor />);

    expect(container.querySelector("button").innerHTML).toBe("Add profile");
});

test("When profile has been updated, an 'Edit' button is rendered", () => {
    const { container } = render(
        <ProfileEditor
            profileUpdated={true}
            birthday="1990-06-29"
            gender="male"
            seeking="females"
            interests={[]}
            symptoms={[]}
            about=""
        />
    );

    expect(container.querySelector("button").innerHTML).toBe("Edit profile");
});

test("Clicking 'Add' button causes editProfile div and save button to be rendered", () => {
    const myMockOnClick = jest.fn();
    const { container } = render(
        <ProfileEditor interests={[]} symptoms={[]} onClick={myMockOnClick} />
    );

    fireEvent.click(container.querySelector("button"));

    expect(container.querySelector(".editProfile").innerHTML).toContain(
        '<button id="save">Save</button>'
    );
});

jest.mock("../axios.js");

test("Clicking the 'Save' button causes an ajax request", () => {
    axios.post.mockResolvedValue({
        data: {
            success: true
        }
    });

    const { container } = render(
        <ProfileEditor interests={[]} symptoms={[]} />
    );

    fireEvent.click(container.querySelector("button"));

    fireEvent.click(container.querySelector("#save"));

    axios.post().then(({ data }) => {
        expect(data.success).toBe(true);
    });
});

test("When the mock request is successful, the function that was passed as a prop to the component gets called", async () => {
    const myMockSetProfile = jest.fn();

    axios.post.mockResolvedValue({
        data: {
            success: true
        }
    });

    const { container } = render(
        <ProfileEditor
            interests={[]}
            symptoms={[]}
            setProfile={myMockSetProfile}
        />
    );

    fireEvent.click(container.querySelector("button"));

    fireEvent.click(container.querySelector("#save"));

    await waitForElement(() => container.querySelector("div"));

    expect(myMockSetProfile.mock.calls.length).toBe(1);
});
