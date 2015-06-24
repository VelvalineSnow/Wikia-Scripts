// Revamped by Shining-Armor
// Written by Sactage
//
// REQUIRES A YOUTUBE API KEY

if (wgCanonicalSpecialPageName == 'Chat') {
    NodeChatDiscussion.prototype.ytInfoCache = {};
    NodeChatDiscussion.prototype.ytInfo = function(chat) {
        if (mainRoom.isInitialized && !chat.attributes.isInlineAlert) {
            var text = chat.attributes.text,
                search = /https?:\/\/(?:www\.|m\.)?youtube\.com[^ ]+v=([^&# ]*)|https?:\/\/(?:www\.)?youtu\.be\/([^&#\? ]*)/im,
                apikey = "YOUR YOUTUBE API KEY",
                match = text.match(search);
            if (match) {
                var $link = $("a[href='" + match[0] + "']").last(),
                    id = match[1] ? match[1] : match[2];
                if (this.ytInfoCache.hasOwnProperty(id)) {
                    return $link.attr('title', this.ytInfoCache[id]);
                }
                $.get("https://www.googleapis.com/youtube/v3/videos?part=snippet,statistics,contentDetails&id=" + id + "&key=" + apikey, function(data) {
                    try {
                        data = data['items'][0]
                        var info = "[Title]: " + data['snippet']['title'] + "\n[Channel]: " + data['snippet']['channelTitle'] + "\n[Views]: " + data['statistics']['viewCount'];
                        mainRoom.viewDiscussion.ytInfoCache[id] = info;
                        $link.attr('title', info);
                    } catch (e) {
                      console.log('Error retrieving youtube info');
                    }
                });
            }
        }
    }

    mainRoom.model.chats.bind('afteradd', $.proxy(mainRoom.viewDiscussion.ytInfo, mainRoom.viewDiscussion));
}
