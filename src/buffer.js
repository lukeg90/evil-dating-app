{
    index == 0 ? (
        <div className="chatDate">
            <p>{message.date}</p>
        </div>
    ) : (
        message.date != array[index - 1].date && (
            <div className="chatDate">
                <p>{message.date}</p>
            </div>
        )
    );
}
