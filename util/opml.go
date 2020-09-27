package util

import (
	"bytes"
	"encoding/xml"
	"fmt"
	"html"

	"github.com/dhcmrlchtdj/feedbox/database"
)

type opml struct {
	Outlines []outline `xml:"body>outline"`
}

type outline struct {
	URL string `xml:"xmlUrl,attr"`
}

func ExtractLinksFromOPML(content []byte) ([]string, error) {
	var c opml
	err := xml.Unmarshal(content, &c)
	if err != nil {
		return nil, err
	}

	var links []string
	for _, o := range c.Outlines {
		links = append(links, o.URL)
	}
	return links, nil
}

func BuildOPML(urls []string) []byte {
	var b bytes.Buffer

	b.WriteString("<?xml version=\"1.0\" encoding=\"utf-8\"?>\n")
	b.WriteString("<opml version=\"1.0\">\n")
	b.WriteString("<head><title>feeds</title></head>\n")
	b.WriteString("<body>\n")

	for _, url := range urls {
		text := html.EscapeString(ExtractSiteName(url))
		xmlURL := html.EscapeString(url)
		outline := fmt.Sprintf("<outline type=\"rss\" text=\"%s\" xmlUrl=\"%s\"/>\n", text, xmlURL)
		b.WriteString(outline)
	}

	b.WriteString("</body>\n")
	b.WriteString("</opml>\n")

	return b.Bytes()
}

func BuildOPMLFromFeed(feeds []database.Feed) []byte {
	var urls []string
	for _, feed := range feeds {
		urls = append(urls, feed.URL)
	}
	return BuildOPML(urls)
}