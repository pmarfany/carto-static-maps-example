#!/usr/bin/env bash

# Locate python package
PYTHON=`which python3`;

# Check for package
if [[ $? -eq 1 ]]; then
	echo "ERROR: Cannot found python executable";
	exit 1;
fi

# Execute server
${PYTHON} -m "http.server"
