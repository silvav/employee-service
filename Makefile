build:
	rm -f build/build.zip && \
	zip -vrj build/build.zip src/ -x "*.DS_Store" && \
	zip -vr build/build.zip node_modules