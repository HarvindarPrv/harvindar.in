//Creating a Profile Component.
var Profile = function () {
    this.profile = null;

    this.getActiveTheme = function () {
        // here fetching information about active theme.
        var root = document.querySelector(':root');
        var active_theme = root.style.getPropertyValue("--active-theme");
        return active_theme;
    }

    this.sendEmail = () => {
        window.location.href = `mailto:${this.profile.sayHiEmail}?subject=${this.profile.subject}&body=${this.profile.message}`;
    }

    this.reload = () => {
        // here reloading the author image based on theme actived.
        author_image = document.querySelector("#author-image");
        active_theme = this.getActiveTheme();
        author_image.setAttribute("src", this.profile.profile_images[active_theme]);
    }

    this.load = function (profile) {
        // here fetching the active theme.
        active_theme = this.getActiveTheme();

        // here profile jason data will get stored for further uses.
        this.profile = profile;

        // fetching component from webpage.
        author_name = document.querySelector(".author-name");
        designation = document.querySelector(".designation");
        description = document.querySelector("#about-author");
        author_image = document.querySelector("#author-image");
        social_links = document.querySelector("#social");

        // Here setting up inner text of above component.
        authorName = ""
        for (index in profile.name) {
            if (profile.name[index] === " ") {
                authorName += " "
            }
            else {
                authorName += `<span>${profile.name[index]}</span>`;
            }
        }
        author_name.innerHTML = authorName;


        designation.innerText = profile.designation;
        description.innerText = profile.description;
        author_image.setAttribute("src", profile.profile_images[active_theme]);

        social_media = profile.social_media;
        social_media.forEach(element => {
            var herf = document.createElement("a");
            herf.setAttribute("href", element.link);
            herf.setAttribute("target", element.target);
            herf.innerHTML = `<i class="${element.icon}">`
            social_links.append(herf);
        });
    }

    this.__init__ = function () {
        this.letsTalkButton = document.querySelector(".lets-talk-button");

        // Here connecting buttons.
        // this.letsTalkButton.addEventListener("click", this.sendEmail);
    }

    this.__init__();

}

// Creating an percentage based carousel semulator.
var PercentageCarosuleSimulator = function (container, containerHeight) {
    this.container = container;
    this.containerHeight = containerHeight;
    // this.previousButton = previousButton;
    // this.nextButton = nextButton;

    // slide position.
    this.sliderPosition = 0;

    this.removePerFromNumbers = function (str) {
        return str.slice(0, str.length - 1);
    }

    this.onNextPressed = () => {
        // let firstSlidePosition = parseInt(this.removePerFromNumbers(this.container.children[0].style.transform.split(",")[0].slice(10, 15)));
        let lastSlidePosition = parseInt(this.container.children[this.container.children.length - 1].style.transform.split("(")[1].split("%")[0]);

        if (lastSlidePosition > 0) {

            this.sliderPosition -= 1;
            tempIndex = this.sliderPosition;

            for (var index of Array(this.container.children.length).keys()) {

                var element = this.container.children[index];

                element.style.position = "absolute";
                element.style.top = "50%";

                element.style.transform = `translate(${tempIndex * 100}%, -50%)`;

                tempIndex += 1;

            }

        }
    }

    this.onPreviousPressed = () => {
        let firstSlidePosition = parseInt(this.removePerFromNumbers(this.container.children[0].style.transform.split(",")[0].slice(10, 15)));

        if (firstSlidePosition < 0) {

            this.sliderPosition += 1;
            tempIndex = this.sliderPosition;

            for (var index of Array(this.container.children.length).keys()) {

                var element = this.container.children[index];

                element.style.position = "absolute";
                element.style.top = "50%";

                element.style.transform = `translate(${tempIndex * 100}%, -50%)`;

                tempIndex += 1;

            }

        }
    }

    this.__init__ = function () {

        // here setting up relative postion on container.
        this.container.style.position = "relative";

        // here setting up absolute position on all children so that i can move.
        this.sliderPosition = 0;
        tempIndex = this.sliderPosition;

        for (var index of Array(this.container.children.length).keys()) {

            var element = this.container.children[index];

            element.style.position = "absolute";
            element.style.top = "50%";

            element.style.transform = `translate(${tempIndex * 100}%, -50%)`;

            tempIndex += 1;

        }
    }

    this.__init__();
}

// Creating an carousel semulator.
var CarosuleSimulator = function (container, gap, vertically_center = true, top_bottom_gap = 0, previousButton = null, nextButton = null, front_space = 0, back_space = 0) {
    this.top_bottom_gap = top_bottom_gap;
    this.slides = [];
    this.translateY = 0;
    this.container = container;
    this.vertically_center = vertically_center;
    this.gap = gap;

    this.sliders_width = 0;

    this.nextButton = nextButton;
    this.previousButton = previousButton;
    this.front_space = front_space;
    this.back_space = back_space;

    this.isSliding = false;
    this.screenX = null;
    this.screenY = null;

    // these varibale will manage the state of live maping with parent container.
    this.parentContainer = null;
    this.parentContainerMapping = false;

    this.setUpperContainerMapping = function (parentContainer, active = true) {
        this.parentContainer = parentContainer;
        this.parentContainerMapping = active;

    }

    this.onMouseMove = (event) => {
        try {
            if (event.sourceCapabilities.firesTouchEvents) {
                this.screenX = event.touches[0].screenX;
                this.screenY = event.touches[0].screenY;
            }
            else {
                this.screenX = event.screenX;
                this.screenY = event.screenY;
            }
        } catch (e) {
            this.onSlideScrollDeactive();
        }
    }

    this.removePxFromNumbers = function (str) {
        return str.slice(0, str.length - 2);
    }

    this.onSlideScrollActive = (event) => {
        this.isSliding = true;
        this.onSlide(event);

    }

    this.onSlideScrollDeactive = () => {
        this.isSliding = false;
        this.screenX = null;
        this.screenY = null;
    }

    this.onSlide = (event) => {
        var coordinates = [];

        try {

            if (event.sourceCapabilities.firesTouchEvents)
                var active_position_x = event.touches[0].screenX;
            else
                var active_position_x = event.screenX;

        } catch (e) {
            return;
        }

        // here adding a overlay layer to stop hover effact.
        var overlay = document.createElement("div");
        overlay.setAttribute("style", "width: 100%; height: 100%; background-color: #ffffff00; position: absolute;");
        this.container.append(overlay);


        for (index in this.slides) {
            coordinates.push(this.slides[index].translateX);
            this.slides[index].element.style.transition = "none";
        }

        var previous_slide_value = 0;
        var slidingDirection = null;

        // Here getting container width to stop over slide element.
        var container_width = this.getContainerWidth();

        const slide_interval = setInterval(() => {

            if (this.screenX != null && this.screenY != null) {

                var slide_value = active_position_x - this.screenX;

                if (slide_value !== previous_slide_value) {

                    if (slide_value > 0) {

                        // Sliding Left Side.
                        if (!((coordinates[coordinates.length - 1] + this.slides[this.slides.length - 1].width + this.back_space) - slide_value < container_width)) {
                            for (index in this.slides) {
                                this.slides[index].translateX = coordinates[index] - slide_value;
                                this.slides[index].element.style.transform = `translate(${this.slides[index].translateX}px, ${this.translateY}%)`;
                            }

                            slidingDirection = "left";
                        }
                    }
                    else if (slide_value < 0) {

                        // Sliding right side.
                        slide_value = slide_value * -1;

                        if (!(coordinates[0] + slide_value > 0 + this.front_space)) {
                            for (index in this.slides) {
                                this.slides[index].translateX = coordinates[index] + slide_value;
                                this.slides[index].element.style.transform = `translate(${this.slides[index].translateX}px, ${this.translateY}%)`;
                            }

                            slidingDirection = "right";
                        }

                    }
                }


            }

            if (!this.isSliding) {

                for (index in this.slides) {
                    this.slides[index].element.style.transition = null;
                }

                this.container.removeChild(overlay);
                clearInterval(slide_interval);

                if (slidingDirection !== null) {
                    if (slidingDirection === "left") {
                        this.onPreviousPressed();
                    }
                    else {
                        this.onNextPressed();
                    }
                }
            }

        }, 1);
    }

    this.onNextPressed = () => {
        var first_slide = null;
        var container_width = this.getContainerWidth();

        for (var index of Array(this.slides.length).keys()) {
            element = this.slides[this.slides.length - index - 1];
            if (element.translateX < 0) {
                first_slide = element;
                break;
            }
        }

        if (first_slide !== null) {

            if (parseInt(first_slide.width + (first_slide.width / 2)) > container_width) {
                var gap = (0 + parseInt((container_width - first_slide.width) / 2)) - element.translateX;
            }
            else {
                var gap = (0 + this.front_space) - first_slide.translateX;
            }

            for (var index of Array(this.slides.length).keys()) {
                element = this.slides[index];
                element.translateX += gap;
                element.element.style.transform = `translate(${element.translateX}px, ${this.translateY}%)`;
            }

        }

        this.onContainerResize();
    }

    this.onPreviousPressed = () => {
        var last_slide = null;
        var container_width = this.getContainerWidth();

        for (var index of Array(this.slides.length).keys()) {
            element = this.slides[index];
            if (element.translateX + element.width + this.back_space > container_width) {
                last_slide = element;
                break;
            }
        }

        if (last_slide !== null) {

            if (parseInt(last_slide.width + (last_slide.width / 2)) > container_width) {
                var gap = element.translateX - parseInt((container_width - last_slide.width) / 2);
            }
            else {
                var gap = (last_slide.translateX + last_slide.width + this.back_space) - container_width;
            }

            for (var index of Array(this.slides.length).keys()) {
                element = this.slides[index];
                element.translateX -= gap;
                element.element.style.transform = `translate(${element.translateX}px, ${this.translateY}%)`;
            }
        }
    }

    this.getContainerWidth = () => {
        var container_width = window.getComputedStyle(this.container).width;
        container_width = parseInt(this.removePxFromNumbers(container_width));
        return container_width;
    }

    this.getContainerHeight = () => {
        var container_height = window.getComputedStyle(this.container).height;
        container_height = parseInt(this.removePxFromNumbers(container_height));
        return container_height;
    }

    this.onContainerResize = () => {

        // Here writing this code to map child container with parent. and this code will get executed when parent container mapping is active.
        if (this.parentContainerMapping) {
            var parentContainerWidth = window.getComputedStyle(this.parentContainer).width;
            parentContainerWidth = parseInt(this.removePxFromNumbers(parentContainerWidth));

            if (parentContainerWidth > this.sliders_width) {
                this.container.style.width = `${this.sliders_width}px`;
            }
            else {
                this.container.style.width = null;
            }

        }

        if (this.slides.length > 0) {

            var container_width = this.getContainerWidth();
            var starting_slide = this.slides[0];
            var last_slide = this.slides[this.slides.length - 1];

            if (this.nextButton !== null && this.previousButton !== null) {

                if (last_slide.translateX + last_slide.width <= container_width && starting_slide.translateX >= 0) {
                    this.nextButton.style.display = "none";
                    this.previousButton.style.display = "none";
                }
                else {
                    this.nextButton.style.display = "flex";
                    this.previousButton.style.display = "flex";
                }
            }
        }
    }

    this.__init__ = function () {
        // here adding elevent listner on buttons.
        if (this.nextButton !== null) {
            this.nextButton.addEventListener("click", this.onNextPressed);
        }

        if (this.previousButton !== null) {
            this.previousButton.addEventListener("click", this.onPreviousPressed);
        }

        window.addEventListener("resize", this.onContainerResize);
        this.container.addEventListener("mousedown", this.onSlideScrollActive);
        this.container.addEventListener("mouseup", this.onSlideScrollDeactive);

        this.container.addEventListener("touchstart", this.onSlideScrollActive);
        this.container.addEventListener("touchend", this.onSlideScrollDeactive);

        this.container.addEventListener("mouseleave", this.onSlideScrollDeactive);

        window.addEventListener("mousemove", this.onMouseMove);
        window.addEventListener("touchmove", this.onMouseMove);

        // here setting up relative postion on container.
        this.container.style.position = "relative";

        // here setting up the translate Y property, if vertically_center is true then it move toword center.
        if (this.vertically_center) {
            this.translateY = -50;
        }

        // here setting up absolute position on all children so that i can move.
        this.slide_max_height = 0;

        for (var index of Array(this.container.children.length).keys()) {

            var element = this.container.children[index];

            element.style.position = "absolute";
            if (this.vertically_center) {
                element.style.top = "50%";
            }

            var height = parseInt(this.removePxFromNumbers(window.getComputedStyle(element).height));
            if (height > this.slide_max_height) {
                this.slide_max_height = height
            }


            if (this.slides.length === 0) {

                var width = parseInt(this.removePxFromNumbers(window.getComputedStyle(element).width));
                var element_obj = { element: element, width: width, translateX: this.front_space };

                element.style.transform = `translate(${element_obj.translateX}px, ${this.translateY}%)`;
                this.slides.push(element_obj);

                this.sliders_width += width;

            }
            else {

                var width = parseInt(this.removePxFromNumbers(window.getComputedStyle(element).width));
                var element_obj = {
                    element: element, width: width,
                    translateX: this.slides[this.slides.length - 1].translateX + this.slides[this.slides.length - 1].width + this.gap
                };

                element.style.transform = `translate(${element_obj.translateX}px, ${this.translateY}%)`;
                this.slides.push(element_obj);

                this.sliders_width += width + this.gap;

            }

        }

        this.onContainerResize();

        this.container.style.minHeight = `${this.slide_max_height + this.top_bottom_gap}px`;

        var container_width = window.getComputedStyle(this.container).width;
        container_width = parseInt(this.removePxFromNumbers(container_width));

        if (container_width > this.sliders_width) {
            if (this.nextButton !== null && this.previousButton !== null) {

                this.nextButton.style.display = "none";
                this.previousButton.style.display = "none";
            }
        }
    }
}

//Creting a Component for Services.
var Services = function () {
    this.services_jason = null;
    this.services_container = document.querySelector(".services-carousel");

    this.carosuleSimulator = new CarosuleSimulator(this.services_container, 50, true, 80,
        document.querySelector("#services-button-left"), document.querySelector("#services-button-right"),
        35, 35);

    this.load = function (services_jason) {
        this.services_jason = services_jason;

        this.services_jason.forEach((element) => {
            var inner_html = `
            <div class="card-icon">
                <i class="${element.icon}"></i>
            </div>
            <h3 class="card-heading">${element.name}</h3>
            <p class="card-description">${element.description}</p>`

            var element = document.createElement("div");
            element.setAttribute("class", "card button");
            element.innerHTML = inner_html;

            this.services_container.append(element);

        })

        this.carosuleSimulator.__init__();

    }
}

// Here creating aboutMe section component.
let AboutMe = function () {
    this.jasonData = null;

    this.load = function (jasonData) {
        this.jasonData = jasonData;

        // here setting up description.
        this.description.innerText = jasonData.description;

        // here adding all the tags.
        for (var jasonTag of jasonData.tags) {
            var tag = document.createElement("p");
            tag.classList.add("button");
            tag.innerHTML = jasonTag;
            this.tags.append(tag);
        }

        // here adding all the cards.
        for (var jasonCard of jasonData.cards) {
            var card = document.createElement("div");
            card.classList.add("card");
            card.classList.add("button");

            card.innerHTML = `
            <div class="card-icon">
                <i class="${jasonCard.icon}"></i>
            </div>
            <h3 class="card-heading">${jasonCard.name}</h3>
            <p class="card-description">${jasonCard.description}</p>
            `;

            this.cards.append(card);
        }
    }

    this.getElement = function (query) {
        return document.querySelector(query);
    }

    this.__init__ = function () {
        this.description = this.getElement(".about-me-description");
        this.tags = this.getElement(".about-me-tags");
        this.cards = this.getElement(".about-me-cards");
    }

    this.__init__();
}


// Here creating Page element it will be a Stack Widget Page that will represent each page of StackWidget.
var StackWidgetPage = function (visible_element_count = 9) {

    // this variable will represnt that how many elements will be visible on the page. and for the remaining element next button will be prepared for navigate on.
    this.visible_element_count = visible_element_count;
    this.elements = [];
    this.navigatorButtons = [];
    this.nextButton = null;
    this.isNavigatorButtonVisible = false;
    this.currentPage = 0;

    this.__init__ = function () {

        this.page = document.createElement("div");
        this.page.setAttribute("class", "stack-widget-page");
        this.page.innerHTML = `
        <div id="contentHolder" class="stack-widget-content-page">
            
        </div>

        <div id="contentNavigators" class="stack-widget-content-navigators">

        </div>`;

        this.contentHolder = this.page.querySelector("#contentHolder");
        this.contentNavigators = this.page.querySelector("#contentNavigators");

        // here setting up content Navigator hidden initialy.
        this.contentNavigators.style.visibility = "hidden";

        // Here adding next button in navigators.
        this.nextButton = document.createElement("div");
        this.nextButton.innerText = "Next";
        this.nextButton.setAttribute("class", "button stack-widget-content-navigator");
        this.nextButton.setAttribute("index", "next");

        this.nextButton.addEventListener("click", this.navigateContent);
        this.contentNavigators.append(this.nextButton);

    }

    this.addNavigatorButton = function (buttonText, index) {
        //<div class="button stack-widget-content-navigator">1</div>

        var button = document.createElement("div");
        button.innerText = buttonText;
        button.setAttribute("class", "button stack-widget-content-navigator");
        button.setAttribute("index", `${index}`);

        button.addEventListener("click", this.navigateContent);

        this.contentNavigators.insertBefore(button, this.nextButton);
        this.navigatorButtons.push(button);
        return button;
    }

    this.getRangeOfCurrentPage = (customCurrentPage = null) => {
        if (customCurrentPage !== null) {
            return {
                start: this.visible_element_count * customCurrentPage,
                end: (this.visible_element_count * customCurrentPage) + this.visible_element_count - 1
            };
        }
        else {
            return {
                start: this.visible_element_count * this.currentPage,
                end: (this.visible_element_count * this.currentPage) + this.visible_element_count - 1
            };
        }
    }

    this.reManageNavigatorButton = () => {

    }

    this.addElement = function (element) {
        this.elements.push(element);
        var index = this.elements.indexOf(element);
        var currentRage = this.getRangeOfCurrentPage();
        if (index >= currentRage.start && index <= currentRage.end) {
            this.contentHolder.append(element);
        }

        // here adding buttons.
        var lastButton = 0;
        if (this.elements.length % this.visible_element_count > 0)
            lastButton += 1;
        lastButton += parseInt(this.elements.length / this.visible_element_count);

        if (lastButton > this.navigatorButtons.length) {
            this.addNavigatorButton(`${lastButton}`, `${lastButton - 1}`);

            if (this.navigatorButtons.length >= 2 && (!this.isNavigatorButtonVisible)) {
                this.contentNavigators.style.visibility = "visible";
                this.isNavigatorButtonVisible = true;
                this.navigatorButtons[this.currentPage].classList.add("stack-widget-navigator-active");
            }
        }

    }

    this.navigateContent = (event) => {
        newPageIndex = event.currentTarget.getAttribute("index");
        if (newPageIndex === "next") {
            newPageIndex = this.currentPage + 1;
        }
        else {
            newPageIndex = parseInt(newPageIndex);
        }
        newRange = this.getRangeOfCurrentPage(newPageIndex);

        if (newRange.start >= 0 && newRange.start < this.elements.length) {

            this.contentHolder.innerHTML = "";
            this.navigatorButtons[this.currentPage].classList.remove("stack-widget-navigator-active");
            this.currentPage = newPageIndex;
            this.navigatorButtons[this.currentPage].classList.add("stack-widget-navigator-active");

            index = newRange.start;
            while (index <= newRange.end && index < this.elements.length) {
                this.contentHolder.append(this.elements[index]);
                index += 1;
            }
        }
    }

    this.__init__();

}


// Here Creating a Stack Widget that will help to switch between diffrent pages.
var StackWidget = function (container) {
    this.container = container;

    // exactly not a constructor function but it will act like a constructor function.
    this.__init__ = function () {

        // this list will store all the pages.
        this.pages = [];

        // this variable will the current active page.
        this.currentPage = null;

    }

    this.getPage = (index) => {
        if (index >= 0 && index < this.pages.length) {
            return this.page[index];
        }
    }

    this.switchToPage = (event) => {
        // here hiding the current active page.
        this.currentPage.page.style.display = "none";

        // here make the new active page visiable.
        var newActivePageIndex = parseInt(event.currentTarget.getAttribute("index"));
        this.currentPage = this.pages[newActivePageIndex];
        this.currentPage.page.style.display = "initial";
    }

    this.addPage = (page, buttonToSwitch) => {
        this.pages.push(page);
        this.container.append(page.page);
        buttonToSwitch.setAttribute("index", `${this.pages.indexOf(page)}`);
        buttonToSwitch.addEventListener("click", this.switchToPage);

        if (this.currentPage === null) {
            this.currentPage = page;
        }
        else {
            page.page.style.display = "none";
        }

    }

    this.__init__();
}


// Here Creating Card For Projects.
var ProjectCard = function (jasonData, readMoreCallBack = null, options = null, playVideoCallBack = null, imageViewCallBack = null) {
    this.jasonData = jasonData;
    this.options = options;
    this.readMoreCallBack = readMoreCallBack;
    this.playVideoCallBack = playVideoCallBack;
    this.imageViewCallBack = imageViewCallBack;
    this.callBackFunctionData = null;

    this.readMore = () => {
        if (this.readMoreCallBack !== null && this.jasonData.readMore !== null) {
            this.readMoreCallBack(this.jasonData.readMore);
        }
    }

    this.viewImages = () => {
        if (this.imageViewCallBack === null) {
            console.log("Didn't recived any call function to show image.");
            return;
        }
        this.imageViewCallBack(this.jasonData.showUp);
    }

    this.playVideo = () => {
        if (this.playVideoCallBack === null) {
            console.log("Didn't recived any call function to play video.");
            return;
        }
        if (this.jasonData.showUpType.toLowerCase() === 'video') {

            this.playVideoCallBack(this.jasonData.showUp, 'normal');
        }
        else if (this.jasonData.showUpType.toLowerCase() === 'youtube-url') {
            this.playVideoCallBack(this.rebuildYoutubeUrl(this.jasonData.showUp), 'iframe');
        }
    }

    this.rebuildYoutubeUrl = (url) => {
        var regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/;
        var match = url.match(regExp);
        var video_id = (match && match[7].length == 11) ? match[7] : false;
        if (!video_id) {
            return url
        }
        return "https://www.youtube.com/embed/" + video_id;
    }

    // this function will help initlize the object.
    this.__init__ = function () {
        this.card = document.createElement("div");

        if (this.options !== null && this.options.activeCardHoverEffect) {
            this.card.setAttribute("class", "projectCard projectCardSlideEffact");
        }
        else {
            this.card.setAttribute("class", "projectCard");
        }

        if (this.jasonData.github === "#" || this.jasonData.github === "") {
            var githubLinkState = "disableLink";
            var githubUrl = "";
        }
        else {
            var githubLinkState = "";
            var githubUrl = target = `target="_blank" href = "${this.jasonData.github}"`;
        }

        this.card.innerHTML = `
        <div class="projectCardHead">
                
            <img class="projectCardLogo" src="${this.jasonData.icon}" alt="">
            
            <div class="heading">
                <h3>${this.jasonData.name}</h3>
                <p>${this.jasonData.dateTime}</p>
            </div>

        </div>

        <div class="proejctCardBody">

            <p class="shortDescription">${this.jasonData.description}</p>

            <div class="projectThumbnail">

                <img class="projectThumbnailImage" src="${this.jasonData.thumbnailImage}" alt="">

                <div class="projectThumbnailType">
                    
                
                </div>

                <div class="videoPlayButton button"><i class="fa-sharp fa-solid fa-play"></i></div>

            </div>

        </div>

        <div class="projectCardFooter">
            <a ${githubUrl} class="projectTech ${githubLinkState}"><i class="fa-brands fa-github"></i> GitHub</a>
            <a class="projectCardReadMoreButton">Read More</a>
        </div>`

        // Here Connecting Read More Button.
        this.readMoreButton = this.card.querySelector(".projectCardReadMoreButton");

        if (this.jasonData.readMore !== null) {

            if (this.jasonData.isReadMoreLink) {
                this.readMoreButton.setAttribute("href", `${this.jasonData.readMore}`);
                this.readMoreButton.setAttribute("target", "_blank");
            }
            else {
                this.readMoreButton.addEventListener("click", this.readMore);
            }

        }
        else {

            // Here if there is no value inside the read more we will disable the readmore button.
            this.readMoreButton.style.visibility = "hidden";

        }

        // Here fecting the video button from web element.
        this.videoPlayButton = this.card.querySelector(".videoPlayButton");
        this.videoPlayButton.addEventListener("click", this.playVideo)

        // Here changing the the d=media type icon based on source.
        var projectThumbnailType = this.card.querySelector(".projectThumbnailType");

        if (this.jasonData.showUpType === "images" || this.jasonData.showUpType === "image") {
            projectThumbnailType.innerHTML = `<div class="image"><i class="fa-regular fa-image"></i></div>`;
            this.videoPlayButton.style.display = "none";

            var projectThumbnailContainer = this.card.querySelector(".projectThumbnail");
            projectThumbnailContainer.addEventListener("click", this.viewImages);
            projectThumbnailContainer.style.cursor = "zoom-in";
        }
        else if (this.jasonData.showUpType === "video" || this.jasonData.showUpType === "youtube-url") {
            projectThumbnailType.innerHTML = `<div class="video"><i class="fa-solid fa-circle-play"></i></div>`;
        }

    }

    this.__init__();

}


// Here defining the object of ReadMoreViewer window.

var ReadMoreViewer = function (progressBar, notification = null) {
    this.jasonData = null;
    this.progressBar = progressBar;
    this.notification = notification;

    this.onCopy = (event) => {

        if (this.notification !== null) {
            var title = event.currentTarget.getAttribute("title");
            var msg = event.currentTarget.getAttribute("msg");
            var value = event.currentTarget.getAttribute("value");
            navigator.clipboard.writeText(value);

            this.notification.push(title, msg, value);
        }
    }

    this.shareVideo = (event) => {
        const shareData = {
            title: event.currentTarget.getAttribute("title"),
            text: event.currentTarget.getAttribute("text"),
            url: event.currentTarget.getAttribute("index"),
        };
        navigator.share(shareData)
    }

    this.show = (jasonData = null) => {
        this.progressBar.start();
        this.jasonData = jasonData;

        // here loading data for some default elements.
        this.pageIcon.setAttribute("src", this.jasonData.icon);
        this.title.innerText = this.jasonData.title;
        this.titleDescription.innerText = this.jasonData.titleLine;

        // Here loading all the data related to tech being used in the project.
        this.usedTechnology.innerHTML = "";

        for (var tech of this.jasonData.usedTech) {
            var element = document.createElement("div");
            element.innerText = tech;
            this.usedTechnology.append(element);
        }

        this.pxcarosuleSimulator = new CarosuleSimulator(this.usedTechnology, 10, true);
        this.pxcarosuleSimulator.__init__();

        // here loading all the feature images.
        this.readMoreFeatureImageContainer.innerHTML = "";

        for (var url of this.jasonData.images) {
            var image = document.createElement("img");
            image.setAttribute("src", url);
            image.setAttribute("id", "readMoreFeatureImage");
            this.readMoreFeatureImageContainer.append(image);
        }

        if (this.jasonData.images.length > 1) {
            this.readMoreFeatureImageCarouselButton.style.display = null;
            this.carosuleSimulator = new PercentageCarosuleSimulator(this.readMoreFeatureImageContainer, 450);
        }

        else {
            // if there si one fetaure image the we will hide carsoule buttons.
            this.readMoreFeatureImageCarouselButton.style.display = "none";
            this.carosuleSimulator = null;
        }

        // Here setting up feature image title and decription.
        this.readMoreImageTitle.innerText = this.jasonData.imageTitle;
        this.readMoreImageDescription.innerText = this.jasonData.imageSortDescription;

        // now let's render the main content of the page.
        this.renderContent();

        // here making read more window visiable.
        this.window.classList.add("readMoreViewerActive");
        this.progressBar.stop();
    }

    this.onNextPressed = (event) => {
        if (this.carosuleSimulator !== null) {
            this.carosuleSimulator.onNextPressed();
        }
        event.stopPropagation();
    }

    this.onPreviousPressed = (event) => {
        if (this.carosuleSimulator !== null) {
            this.carosuleSimulator.onPreviousPressed();
        }
        event.stopPropagation();
    }

    this.renderContent = () => {
        // Before we render the new content in the page let's remove the old one.
        this.readMoreContent.innerHTML = "";

        for (var jasonElement of this.jasonData.content) {

            if (jasonElement.type === "h1" || jasonElement.type === "h2" || jasonElement.type === "h3" || jasonElement.type === "h4" || jasonElement.type === "h5" || jasonElement.type === "p") {

                var element = document.createElement(jasonElement.type);
                this.readMoreContent.append(element);
                element.innerHTML = jasonElement.html;

            }
            else if (jasonElement.type === "gap") {

                var element = document.createElement("div");
                element.classList.add("gap");
                element.style.height = jasonElement.size;
                this.readMoreContent.append(element);

            }
            else if (jasonElement.type === "tags") {
                var tags = document.createElement("div");
                tags.classList.add("readMoreTags");

                for (var jasonTag of jasonElement.tags) {
                    var tag = document.createElement("p");
                    tag.classList.add("tag");
                    tag.innerText = jasonTag;
                    tags.append(tag);
                }

                this.readMoreContent.append(tags);
            }
            else if (jasonElement.type === "link") {

                var link = document.createElement("a");
                link.setAttribute("href", jasonElement.url);
                link.setAttribute("target", "_blank");
                link.innerText = jasonElement.text;
                link.setAttribute("class", jasonElement.class);
                this.readMoreContent.append(link);

            }
            else if (jasonElement.type === "copyLink") {

                var link = document.createElement("p");
                link.setAttribute("index", jasonElement.url);
                link.innerText = jasonElement.text;
                link.setAttribute("class", jasonElement.class);
                link.addEventListener("click", this.onCopy);

                // here adding all the attributes that will be used when user will try to copy the data.
                for (key in jasonElement.copyData) {
                    link.setAttribute(key, jasonElement.copyData[key]);
                }

                this.readMoreContent.append(link);

            }
            else if (jasonElement.type === "image") {

                var element = document.createElement("div");
                element.classList.add("image");
                element.innerHTML = `
                <img src="${jasonElement.url}" alt="">
                <p>${jasonElement.description}</p>
                `;
                this.readMoreContent.append(element);

            }
            else if (jasonElement.type === "video") {

                var element = document.createElement("div");
                element.classList.add("readMoreVideo");
                element.innerHTML = `
                <div class="readMoreVideoShareButton button" index="${jasonElement.url}" title="${jasonElement.shareTitle}" text="${jasonElement.shareText}"><i class="fa-solid fa-share"></i></div>
                <iframe width="100%" height="100%" src="${jasonElement.url}"
                    title="Why Most People FAIL to Learn Programming" frameborder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowfullscreen=""
                "></iframe>
                `;

                // here atteaching call back with video share button.
                var videoShareButton = element.querySelector(".readMoreVideoShareButton");
                videoShareButton.addEventListener("click", this.shareVideo);

                this.readMoreContent.append(element);

            }
            else if (jasonElement.type === "code") {

                var element = document.createElement("div");
                element.classList.add("codeSnippet");
                element.innerHTML = `
                <div class="text">${jasonElement.title}</div>
                <div class="codeSnippetcontent">
                    <pre>${jasonElement.code}</pre>
                </div>
                `;
                this.readMoreContent.append(element);
            }

        }

    }

    this.sharePage = () => {
        if (this.jasonData.sharingLink !== null) {

            const shareData = {
                title: this.jasonData.sharingLink.title,
                text: this.jasonData.sharingLink.text,
                url: this.jasonData.sharingLink.url,
            };
            navigator.share(shareData)

        }
    }

    this.hide = () => {
        this.window.classList.remove("readMoreViewerActive");
    }

    this.__init__ = function () {
        // fetching all the element of ReadMoreViewer window.
        this.window = document.querySelector(".readMoreViewer");
        this.closeButton = document.querySelector(".readMoreViewerCloseButton");

        // here fetching page elements.
        this.pageCloseButton = document.querySelector("#readMoreCloseButton");
        this.shareButton = document.querySelector("#readMoreShareButton");

        this.pageIcon = document.querySelector("#readMoreIcon");
        this.title = document.querySelector("#readMoreTitle");
        this.titleDescription = document.querySelector("#readMoreTitleLine");

        this.usedTechnology = document.querySelector("#readMoreUsedTechnology");

        this.readMoreFeatureImageCarouselButton = document.querySelector("#readMoreFeatureImageCarouselButton");
        this.readMoreFeatureImageCarouselLeft = document.querySelector("#readMoreFeatureImageCarouselLeft");
        this.readMoreFeatureImageCarouselRight = document.querySelector("#readMoreFeatureImageCarouselRight");
        this.readMoreFeatureImageContainer = document.querySelector("#readMoreFeatureImageContainer");
        this.readMoreImageTitle = document.querySelector("#readMoreImageTitle");
        this.readMoreImageDescription = document.querySelector("#readMoreImageDescription");

        this.readMoreContent = document.querySelector("#readMoreContentArea");

        // Here creating variable for carosule semiulator.
        this.carosuleSimulator = null;

        // Here attaching event listeners
        this.closeButton.addEventListener("click", this.hide);
        this.pageCloseButton.addEventListener("click", this.hide);
        this.shareButton.addEventListener("click", this.sharePage);
        this.readMoreFeatureImageCarouselLeft.addEventListener("click", this.onPreviousPressed);
        this.readMoreFeatureImageCarouselButton.children[0].addEventListener("click", this.onPreviousPressed);
        this.readMoreFeatureImageCarouselRight.addEventListener("click", this.onNextPressed);
        this.readMoreFeatureImageCarouselButton.children[1].addEventListener("click", this.onNextPressed);
    }

    this.__init__();
}

// Here creating an component for playing video that will be overlayed on top of the page.
var OverlayVideoPlayer = function (progressBar, maxPlayerWidth = 1280, maxPlayerHeight = 720, margin = 10) {
    this.progressBar = progressBar;
    this.maxPlayerWidth = maxPlayerWidth;
    this.maxPlayerHeight = maxPlayerHeight;
    this.aspectRationHeight = this.maxPlayerHeight / this.maxPlayerWidth;
    this.aspectRationWidth = this.maxPlayerWidth / this.maxPlayerHeight;
    this.margin = margin;

    this.removePxFromNumbers = function (str) {
        return parseInt(str.slice(0, str.length - 2));
    }

    this.onWindowResize = (event) => {
        var windowWidth = event.currentTarget.innerWidth;
        var windowHeight = event.currentTarget.innerHeight;

        var videoConatinerWidth = this.removePxFromNumbers(this.videoPlayerConatiner.style.width);

        if (windowWidth < this.maxPlayerWidth + (this.margin * 2) || windowHeight < this.maxPlayerHeight + (this.margin * 2)) {

            var newPlayerWidth = windowWidth - (this.margin * 4);
            var newPlayerHeight = newPlayerWidth * this.aspectRationHeight;

            if ((newPlayerHeight + (this.margin * 2)) > windowHeight) {
                newPlayerHeight = windowHeight - (this.margin * 2);
                newPlayerWidth = newPlayerHeight * this.aspectRationWidth;
            }

            this.videoPlayerConatiner.style.width = `${newPlayerWidth}px`;
            this.videoPlayerConatiner.style.height = `${newPlayerHeight}px`;

        }
        else if (videoConatinerWidth !== this.maxPlayerWidth) {
            this.videoPlayerConatiner.style.width = `${this.maxPlayerWidth}px`;
            this.videoPlayerConatiner.style.height = `${this.maxPlayerHeight}px`;
        }
    }

    this.videoLoaded = () => {
        // on video loaded stoping the progress bar.
        this.progressBar.stop();

        // here making the video play visible.
        this.videoViewerOverlay.style.display = 'flex';

        if (this.activeVideoPlayer === 'iframe') {
            this.iFramevideoPlayer.style.display = "initial";
        }
        else if (this.activeVideoPlayer === 'normal') {
            this.normalVideoPlayer.style.display = "flex";
        }

    }

    this.playVideo = (url, urlType = "normal") => {
        this.onWindowResize({ currentTarget: window });

        // Here starting the progress bar.
        this.progressBar.start();

        // Here setting up the video url.
        this.activeVideoPlayer = urlType.toLowerCase();
        if (urlType.toLowerCase() === 'normal') {
            this.normalVideoPlayer.addEventListener("loadeddata", this.videoLoaded, false);
            this.normalVideoPlayer.setAttribute("src", url);
        }
        else if (urlType.toLowerCase() === 'iframe') {
            this.iFramevideoPlayer.setAttribute("src", url);
            this.iFramevideoPlayer.onload = this.videoLoaded;
        }
    }

    this.close = () => {
        this.videoViewerOverlay.style.display = 'none';
        if (this.activeVideoPlayer === 'iframe') {
            // here closing the iframe video player.
            this.iFramevideoPlayer.onload = null;
            this.iFramevideoPlayer.setAttribute("src", "");
            this.iFramevideoPlayer.style.display = "none";
        }
        else if (this.activeVideoPlayer === 'normal') {
            // here closing the normal video player.
            this.normalVideoPlayer.removeEventListener("loadeddata", this.videoLoaded);
            this.normalVideoPlayer.style.display = "none";
            this.normalVideoPlayer.setAttribute("src", "");
        }
    }

    this.__init__ = function () {
        this.videoViewerOverlay = document.querySelector(".videoViewer");
        this.closeButton = document.querySelector("#videoViewerCloseButton");
        this.videoPlayerConatiner = document.querySelector("#videoViewerPlayerContainer");
        this.iFramevideoPlayer = document.querySelector("#iframeVideoViewerPlayer");
        this.normalVideoPlayer = document.querySelector("#normalVideoPlayer");

        window.addEventListener("resize", this.onWindowResize);
        this.closeButton.addEventListener("click", this.close);

        this.activeVideoPlayer = null;
    }

    this.__init__();
}


// here Creating and Component of Overlay Image Viewer.
var OverlayImageViewer = function (progressBar) {
    this.progressBar = progressBar;
    this.slides = [];
    this.carosuleSimulator = null;
    this.loadedImages = 0;
    this.totalImages = 0;

    this.createSlide = (image, text = null) => {

        var slide = document.createElement("div");
        // slide.style.width = `${window.innerWidth}px`;
        // slide.style.height = `${window.innerHeight}px`;

        slide.classList.add("slide");

        if (text !== null) {
            slide.innerHTML = `
            <img src="${image}" alt="">
            <div class="text">${text}</div>
            `;
        }
        else {
            slide.innerHTML = `
            <img src="${image}" alt="">
            `;
        }

        // Here Adding call back on image loaded.
        var img = slide.querySelector("img");
        img.addEventListener('load', this.onImageLoaded);

        return slide;
    }

    this.onNextPressed = (event) => {
        if (this.carosuleSimulator !== null) {
            this.carosuleSimulator.onNextPressed();
        }
        event.stopPropagation();
    }

    this.onPreviousPressed = (event) => {
        if (this.carosuleSimulator !== null) {
            this.carosuleSimulator.onPreviousPressed();
        }
        event.stopPropagation();
    }

    this.removeAllSlides = () => {
        this.imageViewerConatiner.innerHTML = "";
        this.slides = [];
    }

    this.showNavigationButtons = () => {
        this.navigationButtons.style.display = null;
    }

    this.hideNavigationButtons = () => {
        this.navigationButtons.style.display = "none";
    }

    this.show = () => {
        this.imageViewerOverlay.style.display = "initial";
    }

    this.close = () => {
        this.imageViewerOverlay.style.display = "none";
    }

    this.onImageLoaded = () => {
        this.loadedImages += 1;

        if (this.loadedImages == this.totalImages) {
            this.show();
            this.progressBar.stop();
        }
    }

    this.viewImages = (images) => {
        // Here setting up value state management.
        this.loadedImages = 0;

        // here starting progress Bar.
        this.progressBar.start();

        // Here removing all the content added before.
        this.removeAllSlides();

        if (typeof (images) === 'string') {
            this.totalImages = 1;

            this.hideNavigationButtons();
            this.carosuleSimulator = null;

            var slide = this.createSlide(images);
            this.slides.push(slide);
            this.imageViewerConatiner.append(slide);

        }
        else {
            this.totalImages = images.length;

            for (var jasonSlide of images) {
                var slide = this.createSlide(jasonSlide.image, jasonSlide.text);
                this.slides.push(slide);
                this.imageViewerConatiner.append(slide);
            }

            if (images.length === 1) {

                this.hideNavigationButtons();
            }
            else if (images.length > 1) {
                this.showNavigationButtons();
                this.carosuleSimulator = new PercentageCarosuleSimulator(this.imageViewerConatiner, 265, this.navigationLeft, this.navigationRight);

                this.carosuleSimulator.__init__();
            }
        }

        // this.show();
        // this.progressBar.stop();
    }

    this.__init__ = function () {
        this.imageViewerOverlay = document.querySelector(".imageViewer");
        this.closeButton = document.querySelector("#imageViewerCloseButton");
        this.imageViewerConatiner = document.querySelector("#imageViewerSlidesContainer");

        this.navigationButtons = document.querySelector(".imageViewerLeftRightButtons");
        this.navigationLeft = document.querySelector("#imageViewerLeftButton");
        this.navigationRight = document.querySelector("#imageViewerRightButton");
        this.leftButtonContainer = document.querySelector(".leftButtonContainer");
        this.rightButtonConatiner = document.querySelector(".rightButtonConatiner");

        // here connecting buttons.
        this.closeButton.addEventListener("click", this.close);
        this.navigationRight.addEventListener("click", this.onNextPressed);
        this.navigationLeft.addEventListener("click", this.onPreviousPressed);

        this.rightButtonConatiner.addEventListener("click", this.onNextPressed);
        this.leftButtonContainer.addEventListener("click", this.onPreviousPressed);
    }

    this.__init__();
}

// Here creating component for main menu.
var MainMenu = function () {
    this.jasonData = null;

    this.getActiveTheme = () => {
        var root = document.querySelector(':root');
        return root.style.getPropertyValue("--active-theme");
    }

    this.showMobileMenu = () => {
        this.mobileMenu.classList.add("mobile-menu-optins-active");
    }

    this.hideMobileMenu = () => {
        this.mobileMenu.classList.remove("mobile-menu-optins-active");
    }

    this.reload = () => {

        // Here reloadng the logo according to the theme.
        this.logo.setAttribute("src", this.jasonData.logo[this.getActiveTheme()]);

    }

    this.load = (jasonData) => {
        this.jasonData = jasonData;

        // Here setting up menu logo and text.
        this.logo.setAttribute("src", this.jasonData.logo[this.getActiveTheme()]);
        this.logoText.innerText = this.jasonData.logoText;

        // here setting up author name and footer message for mobile menu.
        this.authorName.innerText = this.jasonData.authorName;
        this.mobileMenuFooterMessage.innerText = this.jasonData.footerMesaage;

        // here adding all the options in both mobileMenu and normal menu.
        for (var jasonOption of this.jasonData.menuOptions) {
            var link = document.createElement("a");

            // here adding link in mobile menu.
            link.setAttribute("href", jasonOption.link);
            if (jasonOption.link !== "#") {
                link.setAttribute("target", "_blank");
            }
            link.innerHTML = jasonOption.name;
            this.mobileMenuOptions.append(link);

            // here adding link in normal menu.
            var link = document.createElement("a");
            if (jasonOption.link !== "#") {
                link.setAttribute("target", "_blank");
            }
            link.setAttribute("href", jasonOption.link);
            link.innerHTML = jasonOption.name;
            this.menuOptions.append(link);
        }
    }

    this.__init__ = function () {
        this.mobileMenuShowButton = document.querySelector(".mobile-menu-button");
        this.mobileMenuHideButton = document.querySelector(".mobile-menu-optins-close-btn");

        this.mobileMenu = document.querySelector("#mobileMenu");

        this.logo = document.querySelector("#mainMenuLogo");
        this.logoText = document.querySelector("#mainMenuLogoText");

        this.mobileMenuOptions = document.querySelector("#mobileMenuOptions");
        this.authorName = document.querySelector("#mainMenuAuthorName");
        this.mobileMenuFooterMessage = document.querySelector("#mobileMenuBottomMesage");

        this.menuOptions = document.querySelector("#mainMenuOptions");

        // Here connecting button with function.
        this.mobileMenuShowButton.addEventListener("click", this.showMobileMenu);
        this.mobileMenuHideButton.addEventListener("click", this.hideMobileMenu);

    }

    this.__init__();

}


// Here creating A Component for Portfolio that will help to show all the projects.
var Protfolio = function (progressBar, notification = null) {
    this.progressBar = progressBar;
    this.jasonData = null;
    this.projectPageButtons = [];
    this.activePageButton = null;
    this.projectCards = [];
    this.readMoreViewer = new ReadMoreViewer(this.progressBar, notification);
    this.overlayVideoPlayer = new OverlayVideoPlayer(this.progressBar);
    this.overlayImageViewer = new OverlayImageViewer(this.progressBar);

    // in this __init__ function will initlize the object.
    this.__init__ = function () {
        this.heading = document.querySelector("#portfolioHeading");
        this.description = document.querySelector("#portfolioDescription");

        this.projectPageButtonsContainer = document.querySelector("#project-page-buttons");
        this.stackWigetContainer = document.querySelector("#stackWidgetContainer");

        // here created the object stack widget that will all the pages and will only page at a time.
        this.stackWidget = new StackWidget(this.stackWigetContainer);

    }

    this.onPageChnage = (event) => {
        if (this.activePageButton !== null) {
            this.activePageButton.classList.remove("project-active-btn");
        }

        this.activePageButton = event.currentTarget;
        event.currentTarget.classList.add("project-active-btn");
    }

    this.load = function (jasonData) {
        this.jasonData = jasonData;

        var heading_words = this.jasonData.heading.split(" ");
        var headingText = ""
        for (word of heading_words.slice(0, heading_words.length - 1)) {
            headingText += `${word} `;
        }
        if (heading_words.length > 1) {
            headingText += `<span class="primary">${heading_words[heading_words.length - 1]}</span>`;
        }

        this.heading.innerHTML = headingText;
        this.description.innerText = this.jasonData.description;

        this.jasonData.projects.forEach((page) => {

            // Here creating the page navigator button.
            var button = document.createElement("div");
            if (this.projectPageButtons.length === 0) {
                button.setAttribute("class", "button project-btn project-active-btn");
                this.activePageButton = button;
            }
            else {
                button.setAttribute("class", "button project-btn");
            }

            button.innerText = `${page.name}`;
            button.addEventListener("click", this.onPageChnage);
            this.projectPageButtonsContainer.append(button);
            this.projectPageButtons.push(button);

            // Here Creating Page and this page will be added to stackWidget.
            var stack_widget_page = new StackWidgetPage(6);

            page.projects.forEach((projectJason) => {
                var projectCard = new ProjectCard(projectJason, this.readMoreViewer.show, this.jasonData.options, this.overlayVideoPlayer.playVideo, this.overlayImageViewer.viewImages);
                stack_widget_page.addElement(projectCard.card);
                this.projectCards.push(projectCard);
            });

            this.stackWidget.addPage(stack_widget_page, button);

        });

    }

    this.__init__();
}

// here creating component to manage skills.
var Skills = function () {
    this.jasonData = null;

    this.load = function (jasonData) {
        this.jasonData = jasonData;

        this.description.innerText = this.jasonData.description;

        // Here adding card to decription.
        for (var jasoncard of this.jasonData.skills) {
            card = document.createElement("div");
            card.classList.add("skillCard");

            card.innerHTML = `
            <div class="content">
                <img src="${jasoncard.icon}" alt="">
                <p class="percentage">${jasoncard.percentage}%</p>
                <!-- <i class="fa-brands fa-square-js"></i> -->
                <p>${jasoncard.name}</p>
            </div>
            <div id="water" class="water" style="transform: translate(0, ${100 - jasoncard.percentage}%);">
                <svg viewBox="0 0 560 20" class="water_wave water_wave_back">
                    <use xlink:href="#wave"></use>
                </svg>
                <svg viewBox="0 0 560 20" class="water_wave water_wave_front">
                    <use xlink:href="#wave"></use>
                </svg>
            </div>
            `;

            this.cards.append(card);
        }

        // Here applying carousel Simulation.
        this.carosuleSimulator.__init__();

    }

    this.onNextPressed = (event) => {
        if (this.carosuleSimulator !== null) {
            this.carosuleSimulator.onNextPressed();
        }
        event.stopPropagation();
    }

    this.onPreviousPressed = (event) => {
        if (this.carosuleSimulator !== null) {
            this.carosuleSimulator.onPreviousPressed();
        }
        event.stopPropagation();
    }

    this.__init__ = function () {
        this.description = document.querySelector("#skillsDescription");
        this.cards = document.querySelector(".skillCardsContainer");
        this.leftButton = document.querySelector(".skillsLeftButton");
        this.rightButton = document.querySelector(".skillsRightButton");

        this.carosuleSimulator = new CarosuleSimulator(this.cards, 20, true, 100, this.rightButton, this.leftButton);

        // here connecting buttons.
        // this.leftButton.addEventListener("click", this.onPreviousPressed);
        // this.rightButton.addEventListener("click", this.onNextPressed);

    }

    this.__init__();
}

// here creating component to manage experiences.
var Experiences = function () {

    this.load = function (jasonData) {
        this.jasonData = jasonData;
        this.description.innerText = this.jasonData.description;

        // Here loading all the cards.
        var fillUpClass = "timelineContentTop";
        for (var jasonCard of this.jasonData.experience) {
            card = document.createElement("div");
            card.classList.add("timelineCard");

            card.innerHTML = `
            <div class="timelineContent ${fillUpClass}">

                <div class="timelineLeftLine">
                    <span></span>
                    <div></div>
                    <span></span>
                </div>

                <div class="company">
                    <div class="companyLogo"><img src="${jasonCard.logo}" alt=""></div>
                    <div class="companyName">${jasonCard.name}</div>
                </div>
                <p class="workDescription">${jasonCard.description}</p>

            </div>

            <p class="workYear">${jasonCard.date}</p>
            `;

            if (fillUpClass === "timelineContentTop") {
                fillUpClass = "timelineContentbottom";
            }
            else {
                fillUpClass = "timelineContentTop";
            }

            this.cards.append(card);

        }

        // Here adding now time.
        let nowTimeline = document.createElement("div");
        nowTimeline.classList.add("timelineNow")
        nowTimeline.innerHTML = "<p>Now</p>";

        this.cards.append(nowTimeline);

        this.carosuleSimulator.__init__();
    }

    this.__init__ = function () {
        this.description = document.querySelector("#experiencesDescription");
        this.cardsConatiner = document.querySelector(".timeline");
        this.cards = document.querySelector(".timelineCards");
        this.leftButton = document.querySelector(".timelineLeftButton");
        this.rightButton = document.querySelector(".timelineRightButton");

        this.carosuleSimulator = new CarosuleSimulator(this.cards, 0, true, 369, this.rightButton, this.leftButton);
        this.carosuleSimulator.setUpperContainerMapping(this.cardsConatiner, true);
    }

    this.__init__();
}

// Here creating component for MessageForTheUser.
var MessageToUser = function () {

    this.load = function (jasonData) {
        this.jasonData = jasonData;

        this.name.innerText = this.jasonData.name;
        this.authorImage.setAttribute("src", this.jasonData.image);
    }

    this.getVoices = () => {
        let voices = speechSynthesis.getVoices();
        if (!voices.length) {
            let utterance = new SpeechSynthesisUtterance("");
            speechSynthesis.speak(utterance);
            voices = speechSynthesis.getVoices();
        }
        return voices;
    }

    this.pronounceName = () => {
        if ('speechSynthesis' in window) {
            console.log("Name Said: " + this.jasonData.name);

            let speakData = new SpeechSynthesisUtterance();
            speakData.volume = this.jasonData.speakVolume; // From 0 to 1
            speakData.rate = this.jasonData.speakRate; // From 0.1 to 10
            speakData.pitch = this.jasonData.speakPitch; // From 0 to 2
            speakData.text = this.jasonData.sayName;
            speakData.lang = 'en';
            speakData.voice = this.getVoices()[this.jasonData.voiceType];

            speechSynthesis.speak(speakData);

        } else {
            console.log("Can'y Say Nname: " + this.jasonData.name);
        }
    }

    this.sendEmail = () => {
        window.location.href = `mailto:${this.jasonData.sayHiEmail}?subject=${this.jasonData.subject}&body=${this.jasonData.message}`;
    }

    this.__init__ = function () {

        this.authorImage = document.querySelector("#messageToUserAuthorImage");
        this.sayName = document.querySelector("#messageToUserSayName");
        this.name = document.querySelector("#messageToUserAuthorName");
        this.sayHi = document.querySelector("#messageToUserSayHiButton");

        // Here connecting the button with function.
        this.sayName.addEventListener("click", this.pronounceName);
        this.sayHi.addEventListener("click", this.sendEmail);
    }

    this.__init__();
}


// Here creating compoenent for footer.
var Footer = function () {

    this.getActiveTheme = () => {
        var root = document.querySelector(':root');
        return root.style.getPropertyValue("--active-theme");
    }

    this.reload = () => {

        // Here realoading the brand logo according to the active theme.
        this.brandLogo.setAttribute("src", this.jasonData.brand.logo[this.getActiveTheme()]);

    }

    this.load = function (jasonData) {
        this.jasonData = jasonData;

        // here setting up data for brand.
        this.brandLogo.setAttribute("src", this.jasonData.brand.logo[this.getActiveTheme()]);
        this.brandName.innerText = this.jasonData.brand.name;
        this.brandDescription.innerText = this.jasonData.brand.description;

        // here loading contact detains.
        var address = document.createElement("p");
        address.innerText = this.jasonData.contactDetails.address;
        this.contacts.append(address);

        for (var jasonContact of this.jasonData.contactDetails.contacts) {
            var contact = document.createElement("p");
            contact.innerHTML = `<i class="${jasonContact.icon}"></i>${jasonContact.text}`;
            this.contacts.append(contact);
        }

        // Here loading all the quick links.
        for (var jasonLink of this.jasonData.quickLinks) {
            var link = document.createElement("a");
            link.setAttribute("href", jasonLink.link);
            link.setAttribute("target", "_blank");
            link.innerText = jasonLink.name;
            this.quickLinks.append(link);
        }

        // here loading text for copyright.
        this.copyright.innerText = this.jasonData.socialLinks.copyright;

        // here loading all the social links.
        for (var jasonLink of this.jasonData.socialLinks.links) {
            var link = document.createElement("a");
            link.setAttribute("href", jasonLink.link);
            link.setAttribute("target", "_blank");
            link.innerHTML = `<i class="${jasonLink.icon}"></i>`;

            this.socialLinks.append(link);
        }

    }

    this.__init__ = function () {
        this.brandLogo = document.querySelector("#footerBrandLogo");
        this.brandName = document.querySelector("#footerBrandName");
        this.brandDescription = document.querySelector("#footerBrandDescription");
        this.contacts = document.querySelector("#footerContacts");
        this.quickLinks = document.querySelector("#footerQuickLinks");
        this.copyright = document.querySelector("#footerCopyright");
        this.socialLinks = document.querySelector("#footerSocialLinks");
    }

    this.__init__();
}

// Here created theme manager that will help to setup theme.

var ThemeManager = function () {
    this.jasonData = null;
    this.local_storage = "harvindar_in_theme"

    this.load = function (jasonData) {
        this.jasonData = jasonData;
        var theme = null;

        // let's try fetching theme from local storage if it is there.
        try {
            var active_theme = localStorage.getItem(this.local_storage);
            if (active_theme) {
                theme = this.jasonData.themes[active_theme]
            }
            else {
                throw TypeError;
            }
        } catch (error) {

            // Here loading the default theme.
            active_theme = this.jasonData["website-info"]["active-theme"]
            theme = this.jasonData.themes[active_theme]

        }

        var root = document.querySelector(':root');

        for (key in theme) {
            root.style.setProperty("--" + key, theme[key]);
        }

        root.style.setProperty("--active-theme", active_theme);
    }

    this.setTheme = (name) => {
        localStorage.setItem(this.local_storage, name);
        theme = this.jasonData.themes[name]

        var root = document.querySelector(':root');

        for (key in theme) {
            root.style.setProperty("--" + key, theme[key]);
        }

        root.style.setProperty("--active-theme", name);
    }

    this.getActiveTheme = () => {
        var root = document.querySelector(':root');
        return root.style.getPropertyValue("--active-theme");
    }

}

// Here Creating the element to manage the floating menu that will will to chnage the theme and cisit some link.
var FloatingMenu = function (themeManager) {
    this.jasonData = null;
    this.themeManager = themeManager;
    this.activeThemeButton = null;
    this.reloadComponentOnThemeChnage = [];

    this.onThemeChnage = (event) => {
        let theme = event.currentTarget.getAttribute("index");
        this.themeManager.setTheme(theme);

        // here changing the state of the button.
        this.activeThemeButton.classList.remove("fmb-active");

        this.activeThemeButton = event.currentTarget;
        this.activeThemeButton.classList.add("fmb-active");

        for (var component of this.reloadComponentOnThemeChnage) {
            component.reload();
        }
    }

    this.reloadOnThemeChnage = function (component) {
        this.reloadComponentOnThemeChnage.push(component);
    }

    this.load = function (jasonData) {
        this.jasonData = jasonData;

        let activeTheme = this.themeManager.getActiveTheme();

        // here adding theme buttons.
        for (var jasonButton of this.jasonData.themeButton) {
            let button = document.createElement("div");
            button.setAttribute("index", jasonButton.theme);
            if (jasonButton.theme == activeTheme) {
                button.classList.add("floating-menu-button");
                button.classList.add("fmb-active");
                this.activeThemeButton = button;
            }
            else {
                button.classList.add("floating-menu-button");
            }

            button.innerHTML = `<i class="${jasonButton.icon}"></i>`;

            // Here connecting the button with a function to chnage theme.
            button.addEventListener("click", this.onThemeChnage);

            this.body.append(button);
        }

        // here adding the gap element.
        var gap = document.createElement("div");
        gap.classList.add("gap");
        this.body.append(gap);

        // here adding quick links.
        for (var jasonlink of this.jasonData.quickLinks) {
            let link = document.createElement("a");
            link.setAttribute("target", "_blank");
            link.setAttribute("href", jasonlink.link);

            link.innerHTML = `
            <div class="floating-menu-link">
                <i class="${jasonlink.icon}"></i>
            </div>
            `;

            this.body.append(link);
        }


        // here again adding the gap element in the footer.
        var gap = document.createElement("div");
        gap.classList.add("gap");
        this.footer.append(gap);

        // here adding the author icon.
        let authorIcon = document.createElement("img");
        authorIcon.setAttribute("src", this.jasonData.authorIcon);
        this.footer.append(authorIcon);

    }

    this.openCloseMenu = () => {

        if (this.menu.classList.contains("floating-menu-active")) {
            this.menu.classList.remove("floating-menu-active");
        }
        else {
            this.menu.classList.add("floating-menu-active");
        }
    }

    this.__init__ = function () {
        this.menu = document.querySelector(".floating-menu");
        this.closeButton = document.querySelector(".floating-menu-close-button");
        this.body = document.querySelector(".floating-menu-body");
        this.footer = document.querySelector(".floating-menu-footer");

        // here connecting buttons.
        this.closeButton.addEventListener("click", this.openCloseMenu);
    }

    this.__init__();
}

// here creating loader that will indicate loading process.
let ProgressBar = function () {
    this.isLoaderRunning = false;

    this.start = () => {
        this.progress.classList.remove("progressBarActive");
        this.progress.classList.remove("animationCompleted");
        this.progress.style.width = "0%";

        this.progress.classList.add("progressBarActive");
        this.isLoaderRunning = true;
    }

    this.stop = () => {
        this.progress.style.animationName = null;
        this.progress.style.width = window.getComputedStyle(this.progress).width;
        this.progress.classList.add("animationCompleted");

        this.isLoaderRunning = false;
    }

    this.__init__ = function () {
        this.progressBar = document.querySelector(".loader");
        this.progress = document.querySelector(".progressBar");
        this.dot = document.querySelector(".progressBarDot");
    }

    this.__init__();
}

// Here creating component to show notification.
var Notifications = function () {

    this.onNotificationFinished = (event) => {
        event.currentTarget.remove();
    }

    this.push = (topic, message, about) => {
        // here if the about length is more the 23 then let's chop of the about.
        if (about.length > 26) {
            about = about.slice(0, 23) + "...";
        }

        var notification = document.createElement("div");
        notification.addEventListener("animationend", this.onNotificationFinished)
        notification.setAttribute("class", "notifyContainer");

        notification.innerHTML = `
        <div class='notification'>
            <header>
                <span class="ntitle">Messages</span>
                <span class='timestamp'>Now</span>
            </header>
            <div class='content'>
                <span class='sender'>${topic}</span>
                <span class='nmessage'>${message}</span>
                <span class='more'>${about}</span>
            </div>
        </div>
        `;

        this.notifications.append(notification);
    }

    this.__init__ = function () {
        this.notifications = document.querySelector(".notifications");

    }

    this.__init__();
}


// contact us component start here.
var ContactUs = function (progressBar, notification) {

    this.show = () => {
        this.contactUs.classList.remove("contactUsDeactivate");
        this.contactUs.classList.add("contactUsActive");
        this.body.style.overflow = 'hidden';
    }

    this.close = () => {
        this.contactUs.classList.remove("contactUsActive");
        this.contactUs.classList.add("contactUsDeactivate");
        this.body.style.overflow = null;
    }

    this.load = (jasonData) => {
        this.jasonData = jasonData;

        // here setting up heading for the conatct us from.
        this.heading.innerHTML = this.jasonData.heading;

        // here setting up descruiption for the conatct us from.
        this.description.innerHTML = this.jasonData.description;

        // here loading all the icons.  
        for (var jsonLink of jasonData.socialMedia) {
            socialLink = document.createElement("button");
            socialLink.classList.add("form-social-button");
            socialLink.innerHTML = `<a href="${jsonLink.url}" target="_blank"><i class="${jsonLink.icon}"></i></a>`;
            this.socialButtonContainer.append(socialLink);
        }

        // now let's init the email js with public key.
        emailjs.init(this.jasonData.emailJs.publicKey);
    }

    this.sendMessage = (event) => {
        // let's start the progress bar of sending mail.
        this.progressBar.start();

        // here extracting message from the message field.
        var message = this.messageField.value;

        // here let's prepare the data to be sended.
        var message_form = document.createElement("form");
        for (var field of [this.nameField, this.availabilityField, this.emailField, this.messageField]) {
            // inputField = document.createElement(`<input type="${field.type}" name="${field.name}" value="${field.value}" />`);
            message_form.innerHTML += `<input type="${field.type}" name="${field.name}" value="${field.value}" />`;
        }

        // Here send the email.
        emailjs.sendForm(this.jasonData.emailJs.serviceId, this.jasonData.emailJs.TemplateId, message_form)
            .then(() => {
                this.progressBar.stop();
                this.notification.push("Check your mail for the reply.", "The message has been sent 😀", message);
                this.clear();
            }, (error) => {
                this.progressBar.stop();
                this.notification.push("Failed to send", "Failed to send your message 🥺", message);
            });

        event.stopPropagation()
    }

    this.clear = (event) => {
        this.nameField.value = ""
        this.emailField.value = ""
        this.availabilityField.value = ""
        this.messageField.value = ""
        if (event !== null) {
            event.stopPropagation()
        }
    }

    this.__init__ = function () {
        this.notification = notification;
        this.progressBar = progressBar;

        this.body = document.querySelector("body");
        this.contactUsButton = document.querySelector(".lets-talk-button");
        this.contactUs = document.querySelector(".contactUs");
        this.heading = document.querySelector("#contactUsHeading");
        this.description = document.querySelector("#contactUsDescription");
        this.socialButtonContainer = document.querySelector("#contactUsSocialButonContainer");
        this.contactUsBackgroundAnimation = document.querySelector("contactUsBackgroundAnimation");

        this.nameField = document.querySelector("#contactUsName");
        this.availabilityField = document.querySelector("#contactUsAvailableTime");
        this.messageField = document.querySelector("#contactUsMessage");
        this.emailField = document.querySelector("#contactUsEmail");
        this.clearButton = document.querySelector("#contactUsClearButton");
        this.sendButton = document.querySelector("#contactUsSendButton");
        this.closeButton = document.querySelector("#contactUsCloseButton");

        // here connecting buttons with there functions.
        this.contactUsButton.addEventListener("click", this.show);
        this.sendButton.addEventListener("click", this.sendMessage);
        this.clearButton.addEventListener("click", this.clear);
        this.closeButton.addEventListener("click", this.close);

        // here creating some variable with initial value.
        this.jasonData = null;
    }

    this.__init__();
}

// Here's a Data Parser is being created that will help to parse all the data from jason file.

var DataLoader = function (file) {
    this.data_file = file;
    this.notification = new Notifications();
    this.progressBar = new ProgressBar();
    this.profile = new Profile();
    this.services = new Services();
    this.protfolio = new Protfolio(this.progressBar, this.notification);
    this.mainMenu = new MainMenu();
    this.themeManager = new ThemeManager();
    this.floatingMenu = new FloatingMenu(this.themeManager);
    this.aboutMe = new AboutMe();
    this.skills = new Skills();
    this.experiences = new Experiences();
    this.messageToUser = new MessageToUser();
    this.footer = new Footer();
    this.contactUs = new ContactUs(this.progressBar, this.notification);

    this.onCopy = (event) => {

        var title = event.currentTarget.getAttribute("title");
        var msg = event.currentTarget.getAttribute("msg");
        var value = event.currentTarget.getAttribute("value");
        navigator.clipboard.writeText(value);

        this.notification.push(title, msg, value);
    }

    this.loadData = function () {
        fetch(this.data_file)
            .then(response => response.json())
            .then(data => {

                // here loading the theme.
                this.themeManager.load(data);

                // here loading contact us form.
                this.contactUs.load(data["contactUs"]);

                // here setting up the main menu options.
                this.mainMenu.load(data["mainMenu"]);

                // Here setting up profile data.
                this.profile.load(data["author-info"]);

                // Here loading info of about me.
                this.aboutMe.load(data["aboutMe"]);

                // Here Setting up the services section.
                this.services.load(data["services"]);

                // Here loading the portfolio.
                this.protfolio.load(data["protfolio"]);

                // Here loading all the skills.
                this.skills.load(data["skills"]);

                //here loading skill slides.
                this.experiences.load(data["experiences"]);

                //here loading the data for message to user.
                this.messageToUser.load(data["messageToUser"]);

                // Here loading footer.
                this.footer.load(data["footer"]);

                // Here loading the floating menu.
                this.floatingMenu.load(data["themeMenu"]);
                this.floatingMenu.reloadOnThemeChnage(this.profile);
                this.floatingMenu.reloadOnThemeChnage(this.footer);
                this.floatingMenu.reloadOnThemeChnage(this.mainMenu);

                // Here adding call back to all the elements using copy-link class.
                var anchors = document.querySelectorAll('.copy-link');
                for (var i = 0; i < anchors.length; i++) {
                    var anchor = anchors[i];
                    anchor.addEventListener("click", this.onCopy);
                }

            });

    }

}


var data_loader = null;

setTimeout(() => {

    // Here Loading data.
    data_loader = new DataLoader("./data/data.json");
    data_loader.loadData();

}, 0);


// Here setting up a call back on wbpage loaded.
// window.onload = function () {

//     // Here fetching all the element using copy-link class in html and setting up call back function to copy the inner text.
//     var anchors = document.querySelectorAll('.copy-link');
//     for (var i = 0; i < anchors.length; i++) {
//         var anchor = anchors[i];
//         anchor.addEventListener("click", copyText);
//     }
// }
