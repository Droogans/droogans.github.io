serve:
	docker run --rm -it --volume="${PWD}:/srv/jekyll" -p "4000:4000" jekyll/jekyll:3.8 jekyll serve
