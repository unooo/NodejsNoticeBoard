
async function createMsgPopupStr(code,data) {
    let str;
    if (code == "msgSend") {
        let usrStr = await getUserList();
        str = `
        <form id='sendMsgForm'>
        <div style='display:table-cell,text-align:center'>
            <table>
                <tr>
                    <td>받는사람</td>
                    <td>${usrStr}</td>
                </tr>
                <tr><td>제목</td>
                    <td><input name='title' type='text'></td>
                </tr>
                <tr><td>내용</td>
                    <td><textarea name='content'></textarea></td>
                </tr>
                <tr><td colspan='2'><input onclick='sendMsgProcess()'type='button'value='생성'><input onclick='removePopup()' type='button'value='취소'></td>
                </tr>
            </table>
        </div>
        </form>
        `
            ;
    } else if (code == "readMsg") {
        str = ` <div style='display:table-cell,text-align:center'>
<table>
    <tr>
        <td>보낸사람</td>
        <td>${data.sender}</td>
    </tr>
    <tr><td>제목</td>
        <td>${data.title}</td>
    </tr>
    <td>날짜</td>
        <td>${data.createdAt}</td>
    </tr>
    <tr><td>내용</td>
        <td><textarea name='content'>${data.content}</textarea></td>
    </tr>
    <tr><td colspan='2'><input onclick='removePopup()' type='button'value='확인'></td>
    </tr>
</table>
</div>`;
    }
    return str;
}
