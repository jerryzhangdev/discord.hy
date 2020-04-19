"use strict";
const Util = require("../util/util.js")
class RichEmbed {
	constructor(){
		this.fields = [];
	}


	setTitle(content){
		if(!content)throw new Error("You must include a content for the embed title!")
		this.title = content
		return this
	}

	setDescription(content){
		if(!content)throw new Error("You must include a content for the embed description!")
		this.description = content
		return this
	}

	setURL(content){
		if(!content)throw new Error("You must include a content for the embed url!")
		this.url = content
		return this
	}


	setTimestamp(content){
		this.timestamp = content
		return this
	}


	setColor(content){
		if(!content)throw new Error("You must include a color for the embed!")
		this.color = Util.resolveColor(content);
		return this
	}


	setFooter(content, url){
		if(!content)throw new Error("You must include a footer for the embed!")
		if(url){
			var pat = /^https?:\/\//i;
			if (!pat.test(content)){
				throw new TypeError("URL must be absolute!")
			}
		}
		this.footer = {
			"text": content,
			"iconURL": url
		}
		return this
	}


	setImage(content){
		if(!content)throw new Error("You must include a image url for the embed!")
		var pat = /^https?:\/\//i;
		if (pat.test(content)){
			this.image = content
		}else{
			throw new TypeError("URL must be absolute!")
		}
		return this
	}

	
	setThumbnail(content){
		if(!content)throw new Error("You must include a image url for the embed!")
		var pat = /^https?:\/\//i;
		if (pat.test(content)){
			this.image = content
		}else{
			throw new TypeError("URL must be absolute!")
		}
		return this
	}


	addField(name, value, inline){
		if(!inline){
			inline = false
		}
		this.addFields({ name, value, inline })
		return this
	}



  addFields(...fields) {
    this.fields.push(...this.constructor.normalizeFields(fields));
    return this;
  }


  toJSON(){
	 return {
      title: this.title,
      type: 'rich',
      description: this.description,
      url: this.url,
      timestamp: this.timestamp ? new Date(this.timestamp) : null,
      color: this.color,
      fields: this.fields,
      thumbnail: this.thumbnail,
      image: this.image,
      footer: this.footer
        ? {
            text: this.footer.text,
            icon_url: this.footer.iconURL,
          }
        : null,
    };
  }

  static normalizeField(name, value, inline = false) {
    if (!name) throw new Error("Name is undefined");
    if (!value) throw new RangeError('Value is undefined');
    return { name, value, inline };
  }

  static normalizeFields(...fields) {
    return fields
      .flat(2)
      .map(field =>
        this.normalizeField(
          field && field.name,
          field && field.value,
          field && typeof field.inline === 'boolean' ? field.inline : false,
        ),
      );
  }
}

module.exports = RichEmbed;